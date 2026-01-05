<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";

const props = defineProps({
  allPieces: {
    type: Array,
    default: () => [],
  },
  slideshowIds: {
    type: Array,
    default: () => [],
  },
});

const currentIndex = ref(0);
const isPaused = ref(false);
const progress = ref(0);
const duration = 30000;

const slideshowPieces = computed(() => {
  if (!props.allPieces || !props.slideshowIds) return [];
  return props.allPieces.filter((piece) =>
    props.slideshowIds.includes(parseInt(piece.id, 10))
  );
});

const currentPiece = computed(() => {
  if (slideshowPieces.value.length === 0) return null;
  return slideshowPieces.value[currentIndex.value];
});

let startTime = null;
let animationFrame = null;
let lastProgress = 0;

function nextSlide() {
  if (slideshowPieces.value.length > 0) {
    currentIndex.value =
      (currentIndex.value + 1) % slideshowPieces.value.length;
    resetTimer();
  }
}

function prevSlide() {
  if (slideshowPieces.value.length > 0) {
    currentIndex.value =
      (currentIndex.value - 1 + slideshowPieces.value.length) %
      slideshowPieces.value.length;
    resetTimer();
  }
}

function resetTimer() {
  progress.value = 0;
  lastProgress = 0;
  startTime = performance.now();
  if (animationFrame) cancelAnimationFrame(animationFrame);
  if (!isPaused.value) {
    animationFrame = requestAnimationFrame(updateProgress);
  }
}

function updateProgress(timestamp) {
  if (!startTime) startTime = timestamp;

  if (!isPaused.value) {
    const elapsed = timestamp - startTime;
    progress.value = Math.min((elapsed / duration) * 100, 100);

    if (progress.value >= 100) {
      nextSlide();
      return;
    }
  } else {
    startTime = timestamp - (progress.value / 100) * duration;
  }

  animationFrame = requestAnimationFrame(updateProgress);
}

function togglePause() {
  isPaused.value = !isPaused.value;
}

const handleKeydown = (e) => {
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
  if (e.key === " ") {
    e.preventDefault();
    togglePause();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  if (slideshowPieces.value.length > 0) {
    resetTimer();
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  if (animationFrame) cancelAnimationFrame(animationFrame);
});

watch(currentIndex, () => {
  resetTimer();
});

const circumference = 2 * Math.PI * 18;
const offset = computed(
  () => circumference - (progress.value / 100) * circumference
);
</script>

<template>
  <div class="slideshow-player">
    <transition name="ambient-fade">
      <div v-if="currentPiece" :key="'ambient-' + currentPiece.id" class="ambient-bg">
        <img :src="currentPiece.img" class="ambient-img" />
      </div>
    </transition>

    <div class="main-viewport">
      <div class="static-gradient-overlay"></div>

      <transition name="slide-fade" mode="out-in">
        <div v-if="currentPiece" :key="currentPiece.id" class="slide-container">
          <div class="image-wrapper">
            <img :src="currentPiece.img" :alt="currentPiece.name" class="slide-img" />
          </div>
          <div class="slide-text-content">
            <h2 class="slide-title">{{ currentPiece.name }}</h2>
          </div>
        </div>
        <div v-else class="empty-state">No slideshow images found.</div>
      </transition>

      <button class="nav-arrow prev" @click="prevSlide" aria-label="Previous">
        <div class="i-mdi-chevron-left icon"></div>
      </button>
      <button class="nav-arrow next" @click="nextSlide" aria-label="Next">
        <div class="i-mdi-chevron-right icon"></div>
      </button>

      <div class="timer-container" @click="togglePause" :class="{ paused: isPaused }">
        <div class="timer-pie" :style="{
          background: `conic-gradient(${isPaused ? '#ff2727' : '#ffffff'} ${progress * 3.6
            }deg, rgba(255,255,255,0.1) 0deg)`,
        }"></div>
        <div class="pause-overlay">
          <div class="pause-icon">
            <div :class="isPaused ? 'i-mdi-play' : 'i-mdi-pause'"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slideshow-player {
  position: absolute;
  inset: 0;
  background: #000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ambient-bg {
  position: absolute;
  inset: -10%;
  z-index: 0;
  opacity: 0.4;
}

.ambient-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(60px) brightness(0.6);
}

.main-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.image-wrapper {
  width: 90%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 20px 50px rgba(0, 0, 0, 0.5));
}

.slide-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
}

.static-gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 250px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 100%);
  pointer-events: none;
  z-index: 0;
}

.slide-text-content {
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  color: white;
  pointer-events: none;
  text-align: center;
  z-index: 3;
}

.slide-title {
  font-size: clamp(1.5rem, 5vw, 3rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  margin: 0;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.1);
  border: none;
  width: 60px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 10;
  opacity: 0;
}

.main-viewport:hover .nav-arrow {
  opacity: 1;
}

.nav-arrow:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-arrow.prev {
  left: 0;
}

.nav-arrow.next {
  right: 0;
}

.icon {
  font-size: 3rem;
}

.timer-container {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  cursor: pointer;
  z-index: 20;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 4px;
  backdrop-filter: blur(8px);
}

.timer-container:hover {
  transform: scale(1.1);
}

.timer-pie {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: background 0.1s linear;
}

.pause-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
  z-index: 5;
}

.pause-icon {
  color: white;
  font-size: 1.5rem;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.timer-container:hover .pause-overlay,
.timer-container.paused .pause-overlay {
  opacity: 1;
}

.loading-state,
.empty-state {
  color: white;
  font-size: 2rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.loader {
  width: 64px;
  height: 64px;
  border: 6px solid rgba(255, 255, 255, 0.1);
  border-bottom-color: var(--accent, #06b6d4);
  border-radius: 50%;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(50px) scale(0.95);
  filter: blur(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-50px) scale(1.05);
  filter: blur(20px);
}

.ambient-fade-enter-active,
.ambient-fade-leave-active {
  transition: opacity 1.5s ease;
}

.ambient-fade-enter-from,
.ambient-fade-leave-to {
  opacity: 0;
}
</style>
