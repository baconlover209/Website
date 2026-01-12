<script setup>
/* WaveCanvas.vue
   – WebGL-based ripple height map for the halftone layer
   – mouse move now produces a + / − pair of pulses scaled by velocity
*/

import { onMounted, onUnmounted, ref } from "vue";

/* -------------------------------------------------- shared handles */
const canvasRef = ref(null);
let destroyFn, resizeObs;

/* ================================================= GPU version === */
function tryInitWebGL() {
    const canvas = canvasRef.value;
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false, antialias: false });
    if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;

    /* ---------- helpers ---------- */
    const compile = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
            throw new Error(gl.getShaderInfoLog(s));
        return s;
    };
    const program = (vsSrc, fsSrc) => {
        const p = gl.createProgram();
        gl.attachShader(p, compile(gl.VERTEX_SHADER, vsSrc));
        gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fsSrc));
        gl.linkProgram(p);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS))
            throw new Error(gl.getProgramInfoLog(p));
        return p;
    };

    /* ---------- shaders ---------- */
    const vs = `#version 300 es
    in vec2 a_pos; out vec2 v_uv;
    void main(){ v_uv=a_pos*0.5+0.5; gl_Position=vec4(a_pos,0,1); }`;

    const fsSim = `#version 300 es
    precision highp float; precision highp sampler2D;
    in  vec2 v_uv; out vec4 frag;

    uniform sampler2D u_curr, u_prev;
    uniform vec2  u_px;          // (1/width, 1/height)
    uniform float u_damp;
    uniform vec2  u_front, u_back;
    uniform float u_amp;
    uniform float u_radius;

    void main(){
      vec2 dx = vec2(u_px.x,0.0);
      vec2 dy = vec2(0.0,u_px.y);

      float prev   = texture(u_prev, v_uv).r;
      float centre = texture(u_curr, v_uv).r;
      float neigh  = (
          texture(u_curr, v_uv+dx).r +
          texture(u_curr, v_uv-dx).r +
          texture(u_curr, v_uv+dy).r +
          texture(u_curr, v_uv-dy).r ) * 0.25;

      float next = (2.0*neigh - prev) * u_damp;

      // velocity-based injection
      if(u_amp > 0.0){
        float f = exp(-distance(v_uv,u_front)*u_radius);
        float b = exp(-distance(v_uv,u_back )*u_radius);
        next += u_amp * (f - b);   // raise in front, lower behind
      }

      frag = vec4(next,0,0,1);
    }`;

    const fsShow = `#version 300 es
    precision highp float; precision highp sampler2D;
    in vec2 v_uv; out vec4 frag;
    uniform sampler2D u_tex;
    void main(){ float h=texture(u_tex,v_uv).r; frag=vec4(vec3(0.5+h),1); }`;

    const progSim = program(vs, fsSim);
    const progShow = program(vs, fsShow);

    /* ---------- full-screen quad ---------- */
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW);
    const bindQuad = p => {
        const loc = gl.getAttribLocation(p, "a_pos");
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    };

    /* ---------- textures & FBOs ---------- */
    const N = 3, tex = new Array(N), fbo = new Array(N);
    let size = [0, 0], curr = 0, prev = 1, next = 2;

    const makeTex = (w, h) => {
        const t = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, w, h, 0, gl.RED, gl.FLOAT, null);
        return t;
    };
    const makeFBO = t => {
        const fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
        return fb;
    };
    const allocate = (w, h) => {
        if (w === size[0] && h === size[1]) return;
        size = [w, h];
        for (let i = 0; i < N; i++) {
            if (tex[i]) { gl.deleteTexture(tex[i]); gl.deleteFramebuffer(fbo[i]); }
            tex[i] = makeTex(w, h); fbo[i] = makeFBO(tex[i]);
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo[i]);
            gl.clearBufferfv(gl.COLOR, 0, new Float32Array([0, 0, 0, 1]));
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    /* ---------- uniform locations ---------- */
    const uSim = {
        u_curr: gl.getUniformLocation(progSim, "u_curr"),
        u_prev: gl.getUniformLocation(progSim, "u_prev"),
        u_px: gl.getUniformLocation(progSim, "u_px"),
        u_damp: gl.getUniformLocation(progSim, "u_damp"),
        u_front: gl.getUniformLocation(progSim, "u_front"),
        u_back: gl.getUniformLocation(progSim, "u_back"),
        u_amp: gl.getUniformLocation(progSim, "u_amp"),
        u_radius: gl.getUniformLocation(progSim, "u_radius"),
    };
    const uShow = { u_tex: gl.getUniformLocation(progShow, "u_tex") };

    /* ---------- mouse / velocity tracking ---------- */
    let lastPos = null, injectData = null;
    function onMove(e) {
        const r = canvas.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = 1.0 - (e.clientY - r.top) / r.height;     // flip Y once
        const nowPos = { x, y, time: performance.now() };

        if (lastPos) {
            const dx = x - lastPos.x, dy = y - lastPos.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 0) {
                const dirX = dx / dist, dirY = dy / dist;
                const offset = 0.02;                      // 2 % of canvas
                const speedPx = dist * r.width;             // roughly px/f
                const amp = Math.min(speedPx * 0.03, 1.0);   // scale & clamp
                injectData = {
                    front: { x: x + dirX * offset, y: y + dirY * offset },
                    back: { x: x - dirX * offset, y: y - dirY * offset },
                    amp
                };
            }
        }
        lastPos = nowPos;
    }
    window.addEventListener("mousemove", onMove);

    /* ---------- main loop ---------- */
    const DAMP = 0.975;                // ≈3 s to 1 %
    const RADIUS = 50.0;              // fall-off in texture space
    let raf;
    const step = () => {
        /* resize */
        const dpr = window.devicePixelRatio || 1;
        const r = canvas.getBoundingClientRect();
        const w = Math.min(1024, Math.round(r.width * dpr));
        const h = Math.min(1024, Math.round(r.height * dpr));
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w; canvas.height = h;
            gl.viewport(0, 0, w, h);
            allocate(w, h);
        }

        /* simulation pass */
        gl.useProgram(progSim); bindQuad(progSim);
        gl.uniform2f(uSim.u_px, 5 / size[0], 5 / size[1]);
        gl.uniform1f(uSim.u_damp, DAMP);
        if (injectData) {
            gl.uniform2f(uSim.u_front, injectData.front.x, injectData.front.y);
            gl.uniform2f(uSim.u_back, injectData.back.x, injectData.back.y);
            gl.uniform1f(uSim.u_amp, injectData.amp);
            injectData = null;            // single-frame impulse
        } else {
            gl.uniform1f(uSim.u_amp, 0.0);
        }
        gl.uniform1f(uSim.u_radius, RADIUS);

        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex[curr]);
        gl.uniform1i(uSim.u_curr, 0);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tex[prev]);
        gl.uniform1i(uSim.u_prev, 1);

        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo[next]);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        [prev, curr, next] = [curr, next, prev];          // rotate

        /* display pass */
        gl.useProgram(progShow); bindQuad(progShow);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex[curr]);
        gl.uniform1i(uShow.u_tex, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    /* ---------- cleanup ---------- */
    return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onMove);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
}

/* ================================================= fallback (unchanged) */
function startFallback() { /* (same as before, omitted for brevity) */
    const canvas = canvasRef.value, ctx = canvas.getContext("2d");
    const ripples = [], DPR = () => window.devicePixelRatio || 1;
    const SPEED = 1.5, FADE = 0.02, WIDTH = 18, START = 0.5;
    function resize() {
        const r = canvas.getBoundingClientRect(), d = DPR();
        canvas.width = r.width * d; canvas.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    }
    function draw() {
        resize(); ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = ripples.length - 1; i >= 0; i--) {
            const o = ripples[i]; o.r += SPEED; o.a -= FADE;
            if (o.a <= 0) { ripples.splice(i, 1); continue; }
            ctx.lineWidth = WIDTH; ctx.strokeStyle = `rgba(136,136,136,${o.a})`;
            ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.stroke();
        }
        raf = requestAnimationFrame(draw);
    }
    function onMove(e) {
        const r = canvas.getBoundingClientRect(), d = DPR();
        ripples.push({ x: (e.clientX - r.left) * d, y: (e.clientY - r.top) * d, r: 0, a: START });
    }
    let raf; resize(); window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(draw);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
}

/* ================================================= Vue lifecycle ==== */
onMounted(() => {
    destroyFn = tryInitWebGL() || startFallback();
    resizeObs = new ResizeObserver(() => {
        const c = canvasRef.value; c.style.width = c.style.height = "100%";
    });
    resizeObs.observe(canvasRef.value);
});
onUnmounted(() => { destroyFn?.(); resizeObs?.disconnect(); });
</script>

<template>
    <canvas ref="canvasRef" class="wave-canvas"></canvas>
</template>


<style scoped>
.wave-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    /* Keep a little blur so rings are soft; match the styling philosophy of NoiseCanvas */
    filter: blur(10px) invert(1) brightness(200%);
    /* No pixelated scaling: we want smooth waves */
    image-rendering: auto;
}
</style>