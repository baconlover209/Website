<script setup>
import avatarUrl from "../assets/pfp.webp";
import { ref } from 'vue';

const card = ref(null);

function handleMouseMove(e) {
  if (!card.value) return;
  const rect = card.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  card.value.style.setProperty('--lx', `${x}px`);
  card.value.style.setProperty('--ly', `${y}px`);
}
</script>

<template>
  <div class="profile-container">
    <div class="identity-wrapper">
      <div 
        ref="card" 
        class="avatar-frame" 
        @mousemove="handleMouseMove"
      >
        <img :src="avatarUrl" class="avatar-img" />
      </div>
      <h1 class="name-title">DART</h1>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.identity-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.avatar-frame {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 6px solid var(--bg-card);
  background: var(--bg-card);
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 10;
}

.avatar-frame:hover {
  transform: scale(1.1) rotate(-2deg);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
  border-color: var(--accent);
}

.avatar-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle 200px at var(--lx, 50%) var(--ly, 50%), 
    rgba(255, 255, 255, 0.5) 0%, 
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  mix-blend-mode: hard-light;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-frame:hover::after {
  opacity: 1;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name-title {
  font-family: "Outfit", sans-serif;
  font-weight: 900;
  font-size: 3rem;
  letter-spacing: -0.05em;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
  margin: 0;
  color: white !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: default;
}

.name-title:hover {
  transform: scale(1.05) skewX(-5deg);
  text-shadow: 4px 4px 0px rgba(0,0,0,0.2);
  letter-spacing: 0em;
}
</style>
