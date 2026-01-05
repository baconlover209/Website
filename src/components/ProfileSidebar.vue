<script setup>
import avatarUrl from "../assets/pfp.webp";
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  isSlideshowActive: Boolean,
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
      <transition name="fade" mode="out-in">
        <div v-if="!isSlideshowActive" key="profile" class="profile-content">
          <div ref="card" class="avatar-frame" @mousemove="handleMouseMove">
            <img :src="avatarUrl" class="avatar-img" />
          </div>
          <h1 class="name-title">DART</h1>
        </div>
        <div v-else key="datetime" class="datetime-content">
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
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  min-height: 150px;
  transition: all 0.6s ease;
}

.identity-wrapper.slideshow-active {
  height: 100%;
  flex: 1;
}

.profile-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: 100%;
}

.datetime-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  width: 100%;
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
  border-radius: 50%;
  border: 6px solid var(--bg-card);
  background: var(--bg-card);
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 10;
  aspect-ratio: 1;
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
  background: radial-gradient(circle 200px at var(--lx, 50%) var(--ly, 50%),
      rgba(249, 228, 255, 0.5) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%);
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
  }

  .avatar-frame {
    width: 70px;
    height: 70px;
    border-width: 3px;
  }

  .name-title {
    font-size: 2rem;
  }
}
</style>
