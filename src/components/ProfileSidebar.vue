<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Normal from "./Normal.vue";

import pfpUrl from "../assets/pfp.webp";

const props = defineProps({
  isSlideshowActive: Boolean,
  isMobile: Boolean,
});

const card = ref(null);
const currentTime = ref(new Date());

function handleMouseMove(e) {
  if (!card.value) return;
  const rect = card.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  card.value.style.setProperty("--lx", `${x}px`);
  card.value.style.setProperty("--ly", `${y}px`);
}

let timer;
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

const formatTime = (date) => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const formatDate = (date) => {
  return date.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<template>
  <div class="profile-container">
    <div class="identity-wrapper" :class="{ 'slideshow-active': isSlideshowActive }">
      <transition name="fade">
        <div v-show="!isSlideshowActive" class="profile-content">
          <div v-if="isMobile" class="avatar-frame">
            <img :src="pfpUrl" alt="Profile" class="avatar-img" />
          </div>
          <div v-else ref="card" class="avatar-frame" @mousemove="handleMouseMove">
            <normal normal-img="normal.webp" diffuse-img="pfp.webm" />
          </div>
          <h1 class="name-title">DART</h1>
        </div>
      </transition>
      <transition name="fade">
        <div v-show="isSlideshowActive" class="datetime-content">
          <div class="time-display">{{ formatTime(currentTime) }}</div>
          <div class="date-display">{{ formatDate(currentTime) }}</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: all 0.6s ease;
}

.slideshow-active .profile-container {
  height: 100%;
}

.identity-wrapper {
  display: grid;
  place-items: center;
  min-height: 150px;
  transition: all 0.6s ease;
}

.identity-wrapper.slideshow-active {
  height: 100%;
  flex: 1;
}

.profile-content,
.datetime-content {
  grid-area: 1 / 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: 100%;
}

.datetime-content {
  flex-direction: column;
  color: white;
  text-align: center;
}

.time-display {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1;
  text-shadow: 4px 4px 40px rgba(0, 0, 0, 0.9);
  font-variant-numeric: tabular-nums;
}

.date-display {
  font-size: 1.2rem;
  font-weight: 500;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.5rem;
  text-shadow: 4px 4px 40px rgba(0, 0, 0, 0.9);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.avatar-frame {
  width: 150px;
  height: 150px;
  min-width: 150px;
  min-height: 150px;
  border-radius: 50%;
  border: 6px solid var(--bg-card);
  background: var(--bg-card);
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 10;
  aspect-ratio: 1;
  flex-shrink: 0;
}

.avatar-frame:hover {
  transform: scale(1.1) rotate(-2deg);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
  border-color: var(--accent);
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
  z-index: 0;
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
  text-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
  letter-spacing: 0em;
}

@media (max-width: 850px) {
  .identity-wrapper {
    gap: 1rem;
    min-height: 0;
  }

  .avatar-frame {
    width: 60px;
    height: 60px;
    min-width: 60px;
    min-height: 60px;
    border-width: 3px;
  }

  .name-title {
    font-size: 2rem;
  }

  .time-display {
    font-size: 2.5rem;
  }
}
</style>
