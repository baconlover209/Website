<script setup>
import { defineAsyncComponent } from "vue";

import GallerySection from "../components/GallerySection.vue";
</script>

<template>
  <div class="home-view">
    <GallerySection />
  </div>
</template>

<style scoped>
.home-view {
  background: var(--bg-main);
  min-height: 100%;
}
</style>
