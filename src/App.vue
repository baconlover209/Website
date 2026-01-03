<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { preloadImages } from "./utils/preloader";
import avatarUrl from "./assets/pfp.webp";
import charUrl from "./assets/character.webp";
import ProfileSidebar from "./components/ProfileSidebar.vue";
import BioSection from "./components/BioSection.vue";
import ThemeToggle from "./components/ThemeToggle.vue";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Gallery", path: "/gallery" },
  { name: "Comms", path: "/commissions" },
];

const allArt = [
  "/art/bedrot.webp",
  "/art/fdsdffdfd.webp",
  "/art/limebih.webp",
  "/art/wdwdwddwfgghhh.webp",
  "/art/EVIL2.webp",
  "/art/sfdfsdsdfsfdfsvdvds.webp",
  "/art/aeroero22.webp",
  "/art/Erowoak.webp",
  "/art/G2B8JGoWEAA1IEw.webp",
  "/art/G8TcZLMWEAA5qz9.webp",
  avatarUrl,
  charUrl,
];

function updateMouse(e) {
  document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
  document.documentElement.style.setProperty("--my", `${e.clientY}px`);
}

onMounted(() => {
  window.addEventListener("mousemove", updateMouse);
  // preload all art assets immediately
  preloadImages(allArt).then(() => {
    console.log("Art assets cached and ready");
  });
});

const route = useRoute();
const isMobileBioOpen = ref(false);

watch(
  () => route.path,
  () => {
    isMobileBioOpen.value = false;
  }
);

onUnmounted(() => {
  window.removeEventListener("mousemove", updateMouse);
});
</script>

<template>
  <div class="app-layout">
    <header class="top-navbar">
      <nav class="nav-links">
        <RouterLink
          v-for="link in navLinks"
          :key="link.name"
          :to="link.path"
          class="nav-item"
          active-class="nav-active"
        >
          {{ link.name }}
        </RouterLink>
      </nav>
      <div class="nav-logo">
        <ThemeToggle />
      </div>
    </header>

    <div class="main-container">
      <aside class="left-column">
        <div class="sidebar-header animated-halftone">
          <ProfileSidebar />
          <button
            class="mobile-bio-toggle"
            @click="isMobileBioOpen = !isMobileBioOpen"
            aria-label="Toggle Bio"
          >
            <div
              class="icon-toggle"
              :class="
                isMobileBioOpen ? 'i-mdi-chevron-up' : 'i-mdi-chevron-down'
              "
            ></div>
          </button>
        </div>
        <div
          class="sidebar-body"
          :class="{ 'mobile-hidden': !isMobileBioOpen }"
        >
          <BioSection />
        </div>
      </aside>

      <main class="right-column">
        <RouterView v-slot="{ Component }">
          <transition name="page-turn" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
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
  --accent: #38bdf8;
  --sidebar-border: #1e293b;
  --badge-bg: var(--accent);
  --badge-text: #ffffff;
  --halftone-bg: #00b5ec;
  --halftone-opacity: 0.3;
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

@property --x {
  syntax: "<length-percentage>";
  initial-value: 50vw;
  inherits: true;
}

@property --y {
  syntax: "<length-percentage>";
  initial-value: 50vh;
  inherits: true;
}

@property --mx {
  syntax: "<length-percentage>";
  initial-value: 50vw;
  inherits: true;
}

@property --my {
  syntax: "<length-percentage>";
  initial-value: 50vh;
  inherits: true;
}

@property --ix {
  syntax: "<length-percentage>";
  initial-value: 50%;
  inherits: true;
}

@property --iy {
  syntax: "<length-percentage>";
  initial-value: 50%;
  inherits: true;
}

@keyframes drift {
  0% {
    --ix: 20%;
    --iy: 20%;
  }
  30% {
    --ix: 80%;
    --iy: 20%;
  }
  60% {
    --ix: 50%;
    --iy: 80%;
  }
  100% {
    --ix: 20%;
    --iy: 20%;
  }
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
  display: flex;
  flex-direction: column;
  border-right: 4px solid var(--sidebar-border);
  background: var(--bg-sidebar);
  z-index: 10;
  position: relative;
}

.sidebar-header {
  padding: 2rem;
  border-bottom: 4px solid var(--sidebar-border);
  position: relative;
  overflow: hidden;
}

.animated-halftone {
  background: var(--halftone-bg);
  position: relative;
  overflow: hidden;
  animation: drift 10s infinite ease-in-out;
  --x: var(--ix);
  --y: var(--iy);
  transition: 0.35s cubic-bezier(0.1, 0, 0.5, 1.5);
  transition-property: --x, --y;
}

.animated-halftone:hover {
  --x: var(--mx);
  --y: var(--my);
}

.animated-halftone::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  --pattern: radial-gradient(closest-side, #777, #fff) 0/ 1em 1em space;
  --map: radial-gradient(
    circle farthest-corner at var(--x) var(--y),
    #888,
    #fff
  );
  background: var(--pattern), var(--map);
  background-blend-mode: multiply;
  mix-blend-mode: screen;
  filter: contrast(16) invert(1);
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
  transition: all 0.55s cubic-bezier(0.4, 0, 0.2, 1);
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

.right-column > * {
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
