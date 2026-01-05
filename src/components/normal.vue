<script setup>
import { useTemplateRef, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  normalImg: String,
  diffuseImg: String,
});

const canvasRef = useTemplateRef("light");
const diffuseRef = useTemplateRef("diffuse");

let gl;
let program;
let uResolution, uMouse;
let width = 0, height = 0;
let mouseX = 0, mouseY = 0;

// SHADERS
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
  uniform sampler2D u_normalMap;
  varying vec2 v_uv;

  void main() {
    vec4 texColor = texture2D(u_normalMap, v_uv);
    vec3 N = normalize(texColor.rgb * 2.0 - 1.0);
    vec3 lightPos = vec3(u_mouse.x, u_mouse.y, 120.0);
    vec3 pixelPos = vec3(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y, 0.0);
    vec3 L = normalize(lightPos - pixelPos);
    float diffuse = max(dot(N, L), 0.0);
    float intensity = pow(diffuse, 5.0); 
    gl_FragColor = vec4(vec3(intensity), 1.0);
  }
`;

onMounted(async () => {
  const canvas = canvasRef.value;
  gl = canvas.getContext("webgl");
  if (!gl) return;

  // 1. Initialize Shaders and Buffers
  initGL();

  // 2. Wait for the normal image to be fully ready
  await preloadImage(props.normalImg);

  // 3. Setup Texture and Initial Size
  resize();
  window.addEventListener("resize", resize);
  
  // Set initial mouse position to center
  mouseX = canvas.width / 2;
  mouseY = canvas.height / 2;
  render();
});

onUnmounted(() => window.removeEventListener("resize", resize));

// Helper to ensure image is loaded before WebGL touches it
function preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      resolve();
    };
    img.src = url;
  });
}

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
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

  const pos = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  uResolution = gl.getUniformLocation(program, "u_resolution");
  uMouse = gl.getUniformLocation(program, "u_mouse");
}

function resize() {
  const canvas = canvasRef.value;
  const diffuse = diffuseRef.value;
  if (!canvas || !diffuse) return;

  const rect = diffuse.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  width = rect.width * dpr;
  height = rect.height * dpr;
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  gl.viewport(0, 0, width, height);
  gl.uniform2f(uResolution, width, height);
  render();
}

function onMoveMouse(e) {
  const rect = canvasRef.value.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  mouseX = (e.clientX - rect.left) * dpr;
  mouseY = (e.clientY - rect.top) * dpr;
  render();
}

function render() {
  if (!gl) return;
  gl.uniform2f(uMouse, mouseX, mouseY);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function createShader(gl, type, source) {
  const s = gl.createShader(type);
  gl.shaderSource(s, source);
  gl.compileShader(s);
  return s;
}
</script>

<template>
  <div class="scene" @mousemove="onMoveMouse">
    <img ref="diffuse" :src="diffuseImg" class="avatar-img" crossorigin="anonymous">
    <canvas ref="light" class="light"></canvas>
  </div>
</template>

<style scoped>
.scene {
  position: relative;
  display: inline-block;
  line-height: 0;
  cursor: none; /* Optional: hides cursor for better effect */
}

.avatar-img {
  display: block;
  width: 100%;
  max-width: 800px; /* Adjust as needed */
  height: auto;
}

.light {
  position: absolute;
  inset: 0;
  mix-blend-mode: hard-light;
  filter: sepia(.5) saturate(150%) hue-rotate(110deg);
  transition: opacity 1.5s cubic-bezier(0.23, 1, 0.320, 1);
  opacity: 0%;
}

.light:hover{
  opacity: 60%;
}
</style>