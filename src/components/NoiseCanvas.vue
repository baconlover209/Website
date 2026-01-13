<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { noiseFrame } from "../utils/noiseTicker";

const canvasRef = ref(null);
let frameId;

const draw = () => {
  const destCanvas = canvasRef.value;
  if (!destCanvas || !noiseFrame.value) return;
  const ctx = destCanvas.getContext("2d");
  ctx.clearRect(0, 0, destCanvas.width, destCanvas.height);
  ctx.drawImage(noiseFrame.value, 0, 0, destCanvas.width, destCanvas.height);
  frameId = requestAnimationFrame(draw);
};

onMounted(() => {
  draw();
});

onUnmounted(() => {
  cancelAnimationFrame(frameId);
});
</script>

<template>
  <canvas ref="canvasRef" width="10" height="10" class="noise-canvas"></canvas>
</template>

<style scoped>
.noise-canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  image-rendering: pixelated;
  filter: blur(2px) brightness(85%) contrast(150%) brightness(120%);
  /* slight blur to avoid map clipping artifacts from pixelation blocks */
  mix-blend-mode: multiply;
  opacity: 1;
  object-fit: cover;
  display: block;
}
</style>
