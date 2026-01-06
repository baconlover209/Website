<script setup>
import { useTemplateRef, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
  normalImg: String,
  diffuseImg: String,
  lightColor: {
    type: String,
    default: '#f78fc4'
  }
});

const canvasRef = useTemplateRef("canvas");
const containerRef = useTemplateRef("container");

let gl;
let program;
let uResolution, uMouse, uLightColor, uStrength;
let uDiffuseMap, uNormalMap;

let strength = 0;
let targetStrength = 0;
let animationFrameId;
let mouseX = 0.5;
let mouseY = 0.5;

let diffuseTexture, normalTexture;
let imgAspect = 1;

const vsSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    v_uv.y = 1.0 - v_uv.y;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fsSource = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse; 
  uniform vec3 u_lightColor;
  uniform float u_strength; // 0.0 to 1.0
  
  uniform sampler2D u_diffuseMap;
  uniform sampler2D u_normalMap;
  
  varying vec2 v_uv;

  void main() {
    vec4 diffuseColor = texture2D(u_diffuseMap, v_uv);
    vec4 normalColor = texture2D(u_normalMap, v_uv);
    
    // unpack normal
    vec3 N = normalize(normalColor.rgb * 2.0 - 1.0);
    
    // correct for aspect ratio
    float aspect = u_resolution.x / u_resolution.y;
  
    vec2 mouse = vec2(u_mouse.x, u_mouse.y);
    
    vec3 lightPos = vec3(mouse.x * aspect, mouse.y, 0.2); 
    vec3 pixelPos = vec3(v_uv.x * aspect, v_uv.y, 0.0);
    
    vec3 L = normalize(lightPos - pixelPos);
    
    // lighting calculation
    float NdotL = max(dot(N, L), 0.0);
    float falloff = pow(NdotL, 3.0); // Broader beam (was 5.0)
    
    vec3 ambient = vec3(0.85); 
    // light contribution
    vec3 lighting = falloff * u_lightColor * 2.5; // Less bright (was 5.0)
    
    vec3 litRGB = diffuseColor.rgb * (ambient + lighting);

    vec3 finalRGB = mix(diffuseColor.rgb, litRGB, u_strength);
    
    gl_FragColor = vec4(finalRGB, diffuseColor.a);
  }
`;

onMounted(async () => {
  const canvas = canvasRef.value;
  gl = canvas.getContext("webgl");
  if (!gl) return;

  initGL();

  // Load textures
  await Promise.all([
    loadTexture(gl, props.diffuseImg, true).then(t => diffuseTexture = t),
    loadTexture(gl, props.normalImg, false).then(t => normalTexture = t)
  ]);

  // bind textures to units
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, diffuseTexture);
  gl.uniform1i(uDiffuseMap, 0);

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, normalTexture);
  gl.uniform1i(uNormalMap, 1);

  const ro = new ResizeObserver(resize);
  ro.observe(containerRef.value);

  // start loop
  tick();
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
});

function initGL() {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

  const pos = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  uResolution = gl.getUniformLocation(program, "u_resolution");
  uMouse = gl.getUniformLocation(program, "u_mouse");
  uLightColor = gl.getUniformLocation(program, "u_lightColor");
  uStrength = gl.getUniformLocation(program, "u_strength");
  uDiffuseMap = gl.getUniformLocation(program, "u_diffuseMap");
  uNormalMap = gl.getUniformLocation(program, "u_normalMap");
}

function loadTexture(gl, url, isDiffuse) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (isDiffuse) {
        imgAspect = img.height / img.width;
        resize();
      }

      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      resolve(tex);
    };
    img.src = url;
  });
}

function resize() {
  if (!canvasRef.value || !containerRef.value) return;
  const container = containerRef.value;
  const canvas = canvasRef.value;

  const displayWidth = container.clientWidth;
  const displayHeight = displayWidth * imgAspect;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;

  canvas.style.width = displayWidth + 'px';
  canvas.style.height = displayHeight + 'px';

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform2f(uResolution, canvas.width, canvas.height);
}

function onMoveMouse(e) {
  if (!canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  mouseX = (e.clientX - rect.left) / rect.width;
  mouseY = (e.clientY - rect.top) / rect.height;
}

function onEnter() {
  targetStrength = 1.0;
}
function onLeave() {
  targetStrength = 0.0;
}

function tick() {
  strength += (targetStrength - strength) * 0.05;

  render();
  animationFrameId = requestAnimationFrame(tick);
}

function render() {
  if (!gl || !program) return;

  gl.uniform2f(uMouse, mouseX, mouseY);
  gl.uniform1f(uStrength, strength);

  const rgb = hexToRgb(props.lightColor);
  gl.uniform3f(uLightColor, rgb[0], rgb[1], rgb[2]);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function hexToRgb(hex) {
  let c = hex.substring(1);
  if (c.length === 3) c = c.split('').map(char => char + char).join('');
  const bigInt = parseInt(c, 16);
  return [(bigInt >> 16 & 255) / 255, (bigInt >> 8 & 255) / 255, (bigInt & 255) / 255];
}

function createShader(gl, type, source) {
  const s = gl.createShader(type);
  gl.shaderSource(s, source);
  gl.compileShader(s);
  return s;
}
</script>

<template>
  <div ref="container" class="scene" @mousemove="onMoveMouse" @mouseenter="onEnter" @mouseleave="onLeave">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped>
.scene {
  position: relative;
  display: inline-block;
  width: 100%;
  line-height: 0;
  cursor: none;
}

canvas {
  display: block;
}
</style>