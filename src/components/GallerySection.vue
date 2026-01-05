<script setup>
import artUrl from "../assets/character.webp";
import ImageView from "@/components/modals/ImageView.vue";
import { fetchArt } from "@/utils/fetchArt";
import { onMounted, ref } from "vue";

const galleryItems = ref([]);

onMounted(async () => {
  try {
    const data = await fetchArt("homepage");
    galleryItems.value = data.pieces;
  } catch (error) {
    console.error("Error loading gallery items:", error);
  }
});

const featureFullArtRef = "/art/sfdfsdsdfsfdfsvdvds.webp";

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
        <img :src="artUrl" class="feature-img" @click="openImage({ img: featureFullArtRef })" fetchpriority="high"
          loading="eager" />
        <div class="feature-badge">FEATURED</div>
      </div>

      <div class="thumbnails-row overflow-x-scroll hide-scrollbar">
        <div v-for="item in galleryItems" :key="item.id" class="thumb-square-link">
          <div class="thumb-inner flex items-center justify-center">
            <img :src="item.img" class="thumb-img" :alt="item.name" @click="openImage(item)" fetchpriority="high"
              loading="eager" />
          </div>
        </div>
      </div>
    </div>
    <ImageView :image="selectedImage" @close="closeImage" />
  </div>
</template>

<style scoped>
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
}

.feature-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.feature-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--badge-bg);
  color: var(--badge-text);
  padding: 0.5rem 1rem;
  font-weight: bold;
  font-family: "Outfit", sans-serif;
  border-radius: 4px;
  overflow: hidden;
  position: absolute;
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
  aspect-ratio: 1/1;
  height: 100%;
  border: 4px solid var(--border-color);
  background: var(--bg-card);
  padding: 4px;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.thumb-square-link:hover {
  transform: translateY(-4px);
  background: var(--accent);
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumb-inner {
  width: 100%;
  height: 100%;
  border: 2px solid var(--border-color);
  background: var(--bg-card-alt);
  overflow: hidden;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  scrollbar-width: none;
}
</style>
