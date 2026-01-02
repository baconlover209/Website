<script setup>
import artUrl from "../assets/character.webp";

const galleryItems = [1, 2, 3, 4, 5, 6, 7, 8];
</script>

<template>
  <div class="gallery-layout">
    <div class="feature-box">
      <img :src="artUrl" class="feature-img" />
      <div class="feature-badge">FEATURED</div>
    </div>

    <div class="thumbnails-row overflow-x-scroll hide-scrollbar">
      <div v-for="i in galleryItems" :key="i" class="thumb-square">
        <div class="thumb-inner flex items-center justify-center">
          <span
            class="i-fa6-regular-image text-5xl text-gray-400 w-12 h-12 block"
          ></span>
        </div>
      </div>
    </div>
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
}

.thumbnails-row {
  display: flex;
  gap: 1.5rem;
  height: 150px;
}

.thumb-square {
  aspect-ratio: 1/1;
  height: 100%;
  border: 3px solid var(--border-color);
  background: var(--bg-card);
  padding: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.thumb-square:hover {
  transform: translateY(-4px);
  background: var(--accent);
}

.thumb-inner {
  width: 100%;
  height: 100%;
  border: 2px solid var(--border-color);
  background: var(--bg-card-alt);
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar{
  scrollbar-width: none;
}
</style>
