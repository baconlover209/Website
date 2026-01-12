<script setup>
import { computed } from "vue";
import NoiseCanvas from "./NoiseCanvas.vue";
import WaveCanvas from "./WaveCanvas.vue";

const props = defineProps({
  mode: {
    type: String,
    default: "idle",
  },
  x: { type: String, default: "50%" },
  y: { type: String, default: "50%" },
  maskStop: { type: String, default: "0%" },
  dotSize: { type: String, default: "1em" },
});

const mouseStyle = computed(() => ({
  "--x": props.x,
  "--y": props.y,
  "--local-mask-stop": '-67%',
  "--dot-size": props.dotSize,
}));
</script>

<template>
  <div class="halftone-wrapper" :class="mode" :style="mouseStyle">
    <!-- map (noise/gradient) -->
    <div class="halftone-content">
      <NoiseCanvas v-if="mode === 'idle'" />
      <WaveCanvas v-else />
      <div class="dot-grid"></div>
    </div>

    <div class="color-overlay"></div>
  </div>
</template>

<style scoped>
.halftone-wrapper {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  mix-blend-mode: hard-light;
  mask-image: linear-gradient(to top,
      transparent var(--local-mask-stop),
      black 100%);
  -webkit-mask-image: linear-gradient(to top,
      transparent var(--local-mask-stop),
      black 100%);
  transition: opacity .3s ease-in-out;
}

.halftone-content {
  position: absolute;
  inset: 0;
  filter: contrast(16) invert(1);
}

.dot-grid {
  position: absolute;
  inset: 0;
  background: radial-gradient(closest-side, #777, #fff) 0 / var(--dot-size) var(--dot-size);
  background-repeat: repeat;
  mix-blend-mode: multiply;
}

.mouse-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle farthest-corner at var(--x) var(--y),
      #888,
      #fff, #fff);
}

.color-overlay {
  position: absolute;
  inset: 0;
  background-color: var(--halftone-dot-color);
  mix-blend-mode: multiply;
  pointer-events: none;
}
</style>
