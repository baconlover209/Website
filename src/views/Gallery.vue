<script setup>
import ImageView from '@/components/modals/ImageView.vue';
import { ref } from 'vue';

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

const selectedImage = ref(null);

function closeImage() {
    selectedImage.value = null;
}

function openImage(image) {
    selectedImage.value = image;
}
</script>

<template>
    <div>
        <div class="gallery-view">
            <div class="middle-grid m-10">
                <transition-group name="gallery-item" tag="div" class="grid-wrapper">
                    <div v-for="item in galleryItems" :key="item.img" class="grid-item">
                        <div class="item-square hover-subtle hover:cursor-pointer">
                            <img :src="item.img" class="grid-img" :alt="item.name" @click="openImage(item)"/>
                        </div>
                        <div class="item-caption">{{ item.name }} — {{ (new Date(Number(item.date))).toLocaleDateString() }}
                        </div>
                    </div>
                </transition-group>
            </div>
        </div>
        <transition name="modal-fade" mode="out-in">
            <ImageView v-if="selectedImage" :image="selectedImage" @close="closeImage" />
        </transition>
    </div>
</template>

<style scoped>
.gallery-view {
    background: var(--bg-main);
    min-height: 100%;
}

.grid-wrapper {
    display: contents;
}

.middle-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 2rem;
}

.grid-item {
    display: flex;
    flex-direction: column;
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

.item-caption {
    font-weight: 1000;
    text-transform: uppercase;
    font-size: 1.2rem;
    color: var(--text-primary);
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