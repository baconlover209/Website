<script setup>
import artUrl from "../assets/character.webp";
import ImageView from "@/components/modals/ImageView.vue";
import { fetchArt } from "@/utils/fetchArt";
import { onMounted, onUnmounted, ref } from "vue";

const galleryItems = ref([]);
const featuredImage = ref(null);
const isImageLoading = ref(true);

const thumbnailsRow = ref(null);
const isPaused = ref(false);
let animationFrameId;
let pauseTimeout;

const scrollAccumulator = ref(0);

const SCROLL_SPEED = 0.27;

const pickRandomFeatured = async () => {
  isImageLoading.value = true;
  try {
    const homeData = await fetchArt("big_homepage");
    if (homeData.pieces && homeData.pieces.length > 0) {
      const randomIdx = Math.floor(Math.random() * homeData.pieces.length);
      const chosenPiece = homeData.pieces[randomIdx];

      const img = new Image();
      img.src = chosenPiece.img;

      await new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = resolve;
        }
      });

      featuredImage.value = chosenPiece;
    } else {
      featuredImage.value = { img: artUrl, name: 'Featured' };
    }
  } catch (e) {
    console.error(e);
    featuredImage.value = { img: artUrl, name: 'Featured' };
  } finally {
    isImageLoading.value = false;
  }
};

onMounted(async () => {
  try {
    pickRandomFeatured();

    if (thumbnailsRow.value) {
      thumbnailsRow.value.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }

    const smallData = await fetchArt("homepage");
    galleryItems.value = [
      ...smallData.pieces,
      ...smallData.pieces,
      ...smallData.pieces,
      ...smallData.pieces
    ];

    startAutoScroll();
  } catch (error) {
    console.error("Error loading gallery items:", error);
  }
});

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (pauseTimeout) clearTimeout(pauseTimeout);
  if (thumbnailsRow.value) {
    thumbnailsRow.value.removeEventListener("wheel", handleWheel);
  }
});

function startAutoScroll() {
  const scroll = () => {
    if (thumbnailsRow.value && !isPaused.value) {
      handleScrollLoop();

      scrollAccumulator.value += SCROLL_SPEED;
      if (scrollAccumulator.value >= 1) {
        const wrap = Math.floor(scrollAccumulator.value);
        thumbnailsRow.value.scrollLeft += wrap;
        scrollAccumulator.value -= wrap;
      }
    }
    animationFrameId = requestAnimationFrame(scroll);
  };
  animationFrameId = requestAnimationFrame(scroll);
}

function handleScrollLoop() {
  const el = thumbnailsRow.value;
  if (!el) return;

  if (el.scrollLeft >= el.scrollWidth / 2) {
    el.scrollLeft -= el.scrollWidth / 2;
  }
}

function onUserInteraction() {
  isPaused.value = true;
  if (pauseTimeout) clearTimeout(pauseTimeout);

  pauseTimeout = setTimeout(() => {
    isPaused.value = false;
  }, 2000);
}

function handleWheel(event) {
  if (thumbnailsRow.value) {
    event.preventDefault();
    thumbnailsRow.value.scrollLeft += event.deltaY;
    onUserInteraction();
  }
}

function closeImage() {
  selectedImage.value = null;
}

function openImage(image) {
  selectedImage.value = image;
}

const selectedImage = ref(null);
</script>

<template>
  <div class="h-100%">
    <div class="gallery-layout">
      <div class="feature-box">
        <div v-if="isImageLoading" class="loader-container">
          <div class="loader"></div>
        </div>
        <template v-else-if="featuredImage">
          <img :src="featuredImage.img" class="feature-bg" alt="" aria-hidden="true" />
          <img :src="featuredImage.img" class="feature-img" :alt="featuredImage.name" fetchpriority="high"
            loading="eager" />
          <div class="interaction-overlay" @click="openImage(featuredImage)"></div>
        </template>
        <div class="feature-badge">FEATURED</div>
      </div>

      <div class="thumbnails-row overflow-x-scroll hide-scrollbar" ref="thumbnailsRow" @pointerdown="onUserInteraction"
        @touchstart="onUserInteraction" @scroll="handleScrollLoop">
        <div v-for="(item, index) in galleryItems" :key="`${item.id}-${index}`" class="thumb-square-link">
          <div class="thumb-inner flex items-center justify-center" @click="openImage(item)">
            <img :src="item.img" class="thumb-img" :alt="item.name" :fetchpriority="index < 4 ? 'high' : 'auto'"
              :loading="index < 4 ? 'eager' : 'lazy'" />
          </div>
        </div>
      </div>
    </div>
    <ImageView :image="selectedImage" @close="closeImage" />
  </div>
</template>

<style scoped>
.loader-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid var(--bg-card-alt);
  border-top: 4px solid var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.interaction-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  cursor: pointer;
}

.gallery-layout {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  height: 100%;
  gap: 2rem;
}

.feature-box {
  flex: 1;
  border: 3px solid var(--border-color);
  position: relative;
  background: var(--bg-card-alt);
  min-height: 0;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.feature-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(20px) brightness(0.7);
  transform: scale(1.1);
  z-index: 0;
  pointer-events: none;
}

.feature-img {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  pointer-events: none;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.feature-box:hover .feature-img {
  transform: scale(1.02);
}

.feature-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1;
  background: var(--badge-bg);
  color: var(--badge-text);
  padding: 0.5rem 1rem;
  font-weight: bold;
  font-family: "Outfit", sans-serif;
  border-radius: 4px;
  overflow: hidden;
  transform: translate(0, 0px);
  transition: transform 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.feature-badge:hover {
  transform: translate(0, -5px);
  transition: transform 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.feature-badge::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -75%;
  width: 60%;
  height: 200%;
  background: linear-gradient(120deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 100%);
  transform: skewX(-25deg);
  transition: transform 0.6s cubic-bezier(0.4, 1.6, 0.6, 1);
  pointer-events: none;
}

.feature-badge:hover::before {
  transform: translateX(300%) skewX(-25deg);
  transition: transform 0.6s cubic-bezier(0.4, 1.6, 0.6, 1);
}

.thumbnails-row {
  display: flex;
  gap: 1.5rem;
  height: 12rem;
  padding-top: 4px;
}

.thumb-square-link {
  height: 100%;
  border: 4px solid var(--border-color);
  background: var(--bg-card);
  padding: 4px;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  flex: 0 0 auto;
}

.thumb-square-link:hover {
  transform: translateY(-4px);
  background: var(--accent);
}

.thumb-img {
  width: auto;
  height: 100%;
  object-fit: contain;
  display: block;
  pointer-events: none;
}

.thumb-inner {
  width: auto;
  height: 100%;
  border: 2px solid var(--border-color);
  background: var(--bg-card-alt);
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  scrollbar-width: none;
}
</style>
