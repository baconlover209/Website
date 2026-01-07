<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { preloadImages } from "./utils/preloader";
import { fetchArt } from "./utils/fetchArt";
import avatarUrl from "./assets/pfp.webp";
import charUrl from "./assets/character.webp";
import ProfileSidebar from "./components/ProfileSidebar.vue";
import BioSection from "./components/BioSection.vue";
import ThemeToggle from "./components/ThemeToggle.vue";
import SlideshowPlayer from "./components/SlideshowPlayer.vue";
import HalftoneLayer from "./components/HalftoneLayer.vue";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Gallery", path: "/gallery" },
  { name: "Comms", path: "/commissions" },
  { name: "Queue", path: "/queue" },
];

const route = useRoute();
const isMobileBioOpen = ref(false);
const isSlideshowActive = ref(false);
const allPieces = ref([]);
const slideshowIds = ref([]);

const mx = ref("50%");
const my = ref("50%");

function updateGlobalMouse(e) {
  mx.value = `${e.clientX}px`;
  my.value = `${e.clientY}px`;
  document.documentElement.style.setProperty("--mx", mx.value);
  document.documentElement.style.setProperty("--my", my.value);
}

const toggleSlideshow = () => {
  isSlideshowActive.value = !isSlideshowActive.value;
};

onMounted(async () => {
  window.addEventListener("mousemove", updateGlobalMouse);

  const query = route.query;
  if (query.key && query.id) {
    const id = query.id;
    const key = query.key;

    const map = JSON.parse(localStorage.getItem('commission_key_map') || '{}');
    map[id] = key;
    localStorage.setItem('commission_key_map', JSON.stringify(map));

    const list = new Set((localStorage.getItem('commission_keys') || '').split(',').filter(Boolean));
    list.add(key);
    localStorage.setItem('commission_keys', Array.from(list).join(','));

  } else if (query.key) {
    const list = new Set((localStorage.getItem('commission_keys') || '').split(',').filter(Boolean));
    list.add(query.key);
    localStorage.setItem('commission_keys', Array.from(list).join(','));
  }

  try {
    const { pieces, tags } = await fetchArt();
    allPieces.value = pieces;

    const slideshowTag = tags.find((t) => t.slideshow);
    if (slideshowTag) {
      slideshowIds.value = slideshowTag.slideshow;
    }

    const pieceUrls = pieces.map((p) => p.img);
    const assetsToPreload = [...pieceUrls, avatarUrl, charUrl];

    preloadImages(assetsToPreload);
  } catch (err) {
    console.error("Failed to preload art:", err);
  }
});

watch(
  () => route.path,
  () => {
    isMobileBioOpen.value = false;
    isSlideshowActive.value = false;
  }
);

onUnmounted(() => {
  window.removeEventListener("mousemove", updateGlobalMouse);
});
</script>

<template>
  <div class="app-layout" :class="{ 'slideshow-mode': isSlideshowActive }">
    <header class="top-navbar">
      <nav class="nav-links">
        <RouterLink v-for="link in navLinks" :key="link.name" :to="link.path" class="nav-item"
          active-class="nav-active">
          {{ link.name }}
        </RouterLink>
      </nav>
      <div class="nav-logo">
        <ThemeToggle />
      </div>
    </header>

    <div class="main-container">
      <aside class="left-column" :class="{ 'expanded-halftone': isSlideshowActive }">
        <div class="sidebar-header animated-halftone" @click="toggleSlideshow" style="cursor: pointer"
          title="Toggle Relax Mode">
          <div class="inner-glow"></div>
          <HalftoneLayer class="halftone-idle" mode="idle" :mask-stop="isSlideshowActive ? '-50%' : '0%'">
          </HalftoneLayer>
          <HalftoneLayer class="halftone-hover" mode="mouse" :x="mx" :y="my"
            :mask-stop="isSlideshowActive ? '-50%' : '0%'" />

          <div class="sidebar-content-wrapper" :class="{ 'full-height': isSlideshowActive }">
            <ProfileSidebar :is-slideshow-active="isSlideshowActive" />
          </div>
          <button class="mobile-bio-toggle" @click.stop="isMobileBioOpen = !isMobileBioOpen" aria-label="Toggle Bio">
            <div class="icon-toggle" :class="isMobileBioOpen ? 'i-mdi-chevron-up' : 'i-mdi-chevron-down'
              "></div>
          </button>
        </div>
        <div class="sidebar-body" :class="{ 'mobile-hidden': !isMobileBioOpen }">
          <BioSection />
        </div>
      </aside>

      <main class="right-column">
        <RouterView v-slot="{ Component }">
          <transition name="page-turn" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
        <transition name="page-turn" mode="out-in">
          <SlideshowPlayer v-if="isSlideshowActive" :all-pieces="allPieces" :slideshow-ids="slideshowIds" />
        </transition>
      </main>
    </div>
  </div>
</template>

<style>
:root {
  --bg-primary: #f1f5f9;
  --bg-sidebar: #ffffff;
  --bg-navbar: #000000;
  --bg-main: #f1f5f9;
  --bg-card: #ffffff;
  --bg-card-alt: #f8fafc;
  --text-primary: #000000;
  --text-secondary: #334155;
  --text-muted: #475569;
  --text-dim: #e2e8f0;
  --border-color: #000000;
  --nav-text: #ffffff;
  --nav-hover-bg: #222222;
  --nav-active-bg: #333333;
  --accent: #06b6d4;
  --sidebar-border: #000000;
  --badge-bg: #000000;
  --badge-text: #ffffff;
  --halftone-bg: #00b5ec;
  --halftone-opacity: 0.3;
  --halftone-dot-color: #0ff;
}

.dark {
  --bg-primary: #020617;
  --bg-sidebar: #020617;
  --bg-navbar: #000000;
  --bg-main: #020617;
  --bg-card: #0f172a;
  --bg-card-alt: #1e293b;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --text-dim: #1e293b;
  --border-color: #1e293b;
  --nav-text: #ffffff;
  --nav-hover-bg: #1e293b;
  --nav-active-bg: #334155;
  --accent: #32cce0;
  --sidebar-border: #1e293b;
  --badge-bg: var(--accent);
  --badge-text: #ffffff;
  --halftone-bg: #00ccec;
  --halftone-opacity: 0.9;
  --halftone-dot-color: #0ff;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  width: 100%;
  font-family: "Outfit", sans-serif;
  overflow: hidden;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

@property --mask-stop {
  syntax: "<percentage>";
  initial-value: 0%;
  inherits: true;
}

.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  border: 4px solid var(--border-color);
  background: var(--bg-navbar);
}

.top-navbar {
  height: 60px;
  border-bottom: 4px solid var(--border-color);
  display: flex;
  background: var(--bg-navbar);
  flex-shrink: 0;
  z-index: 9999;
}

.nav-links {
  flex: 1;
  display: flex;
}

.nav-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--nav-text);
  font-weight: 800;
  font-size: 1.2rem;
  text-transform: uppercase;
  border-right: 2px solid #333;
  transition: background 0.2s, color 0.2s;
}

.nav-item:hover {
  background: var(--nav-hover-bg);
  color: var(--accent);
}

.nav-active {
  background: var(--nav-active-bg);
  color: var(--accent);
}

.nav-logo {
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-navbar);
  border-left: 2px solid #333;
}

.logo-icon {
  font-weight: 900;
  color: white;
  font-size: 2rem;
}

.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
  background: var(--bg-primary);
}

.mobile-bio-toggle {
  display: none;
}

.left-column {
  flex: 0 0 600px;
  display: grid;
  grid-template-rows: auto 1fr;
  border-right: 4px solid var(--sidebar-border);
  background: var(--bg-sidebar);
  z-index: 10;
  position: relative;
  transition: grid-template-rows 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.left-column.expanded-halftone {
  grid-template-rows: 1fr 0fr;
}

.sidebar-header {
  grid-row: 1;
  padding: 2rem;
  border-bottom: 4px solid var(--sidebar-border);
  position: relative;
  overflow: hidden;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  mix-blend-mode: normal;
}

.expanded-halftone .sidebar-header {
  border-bottom-color: transparent;
  padding: 0;
}

.sidebar-content-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.8s ease;
}

.sidebar-body {
  grid-row: 2;
  overflow: hidden;
  padding: 2rem;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.expanded-halftone .sidebar-body {
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
}

.inner-glow {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10000000000;
  inset: 0;
  opacity: 0.7;
  box-shadow: 0px 0px 4rem var(--halftone-bg) inset;
  mix-blend-mode: normal;
  pointer-events: none;
}

.animated-halftone {
  background: var(--halftone-bg);
  position: relative;
  overflow: hidden;
}

.halftone-idle {
  opacity: var(--halftone-opacity);
  transition: opacity 0.5s ease;
}

.halftone-hover {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.sidebar-header:hover .halftone-idle {
  opacity: 0;
}

.sidebar-header:hover .halftone-hover {
  opacity: var(--halftone-opacity);
}

.sidebar-body {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.right-column {
  flex: 1;
  background: var(--bg-main);
  overflow: hidden;
  perspective: 2000px;
  position: relative;
  transform: translateZ(0);
}

.page-turn-enter-active,
.page-turn-leave-active {
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.page-turn-enter-from {
  opacity: 0;
  transform: rotateY(90deg);
  transform-origin: left center;
}

.page-turn-leave-to {
  opacity: 0;
  transform: rotateY(-90deg);
  transform-origin: right center;
}

.page-turn-enter-to,
.page-turn-leave-from {
  opacity: 1;
  transform: rotateY(0deg);
}

.page-turn-leave-active {
  pointer-events: none;
}

.right-column>* {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

@media (max-width: 1700px) {
  .left-column {
    flex: 0 0 420px;
  }
}

@media (max-width: 1200px) {
  .left-column {
    flex: 0 0 340px;
  }
}

@media (max-width: 850px) {
  .main-container {
    flex-direction: column;
    overflow-y: auto;
  }

  .left-column {
    flex: 0 0 auto;
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 4px solid var(--sidebar-border);
    overflow: visible;
  }

  .sidebar-header {
    padding: 0.75rem;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sidebar-body {
    padding: 1.5rem;
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .sidebar-body.mobile-hidden {
    display: none;
  }

  .mobile-bio-toggle {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: all 0.2s;
    z-index: 50;
  }

  .mobile-bio-toggle:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }

  .icon-toggle {
    font-size: 1.5rem;
  }

  .right-column {
    overflow: visible;
    min-height: 500px;
  }

  .nav-item {
    font-size: 0.9rem;
    padding: 0 0.5rem;
  }
}
</style>
