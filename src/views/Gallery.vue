<script setup>
const galleryItems = [
  { name: "name", date: "23094723082", img: "/art/EVIL2.webp" },
  { name: "name", date: "23094723082", img: "/art/sfdfsdsdfsfdfsvdvds.webp" },
  { name: "name", date: "23094723082", img: "/art/aeroero22.webp" },
  { name: "name", date: "23094723082", img: "/art/EVIL2.webp" },
  { name: "name", date: "23094723082", img: "/art/sfdfsdsdfsfdfsvdvds.webp" },
  { name: "name", date: "23094723082", img: "/art/aeroero22.webp" },
  { name: "name", date: "23094723082", img: "/art/EVIL2.webp" },
  { name: "name", date: "23094723082", img: "/art/sfdfsdsdfsfdfsvdvds.webp" },
  { name: "name", date: "23094723082", img: "/art/aeroero22.webp" },
  { name: "name", date: "23094723082", img: "/art/EVIL2.webp" },
  { name: "name", date: "23094723082", img: "/art/sfdfsdsdfsfdfsvdvds.webp" },
  { name: "name", date: "23094723082", img: "/art/aeroero22.webp" },
  { name: "name", date: "23094723082", img: "/art/EVIL2.webp" },
  { name: "name", date: "23094723082", img: "/art/sfdfsdsdfsfdfsvdvds.webp" },
  { name: "name", date: "23094723082", img: "/art/aeroero22.webp" },
];
</script>

<template>
  <div class="gallery-view">
    <div class="middle-grid m-10">
      <div v-for="item in galleryItems" :key="item.name" class="grid-item">
        <div class="item-square hover-subtle">
          <img :src="item.img" class="grid-img" :alt="item.name" />
        </div>
        <div class="item-caption">{{ item.name }} — {{ item.date }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.middle-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2rem;
}

.item-square {
  aspect-ratio: 1;
  border: 4px solid var(--border-color);
  box-shadow: 8px 8px 0px 0px var(--border-color);
  overflow: hidden;
  margin-bottom: 1rem;
  transition: 0.3s ease;
  background: var(--bg-card);
}

.grid-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hover-subtle:hover {
  transform: translateY(-6px);
  box-shadow: 12px 12px 0px 0px var(--border-color);
}

@media (max-width: 850px) {
  .middle-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 500px) {
  .middle-grid {
    grid-template-columns: 1fr;
  }
}
</style>