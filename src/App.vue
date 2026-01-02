<script setup>
import { defineAsyncComponent } from "vue";

const ProfileSidebar = defineAsyncComponent(() =>
  import("./components/ProfileSidebar.vue")
);
const BioSection = defineAsyncComponent(() =>
  import("./components/BioSection.vue")
);
const GallerySection = defineAsyncComponent(() =>
  import("./components/GallerySection.vue")
);

const navLinks = ["Home", "Projects", "Gallery", "Comms"];

import { onMounted, onUnmounted } from 'vue';

function updateMouse(e) {
  document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
  document.documentElement.style.setProperty('--my', `${e.clientY}px`);
}

onMounted(() => {
  window.addEventListener('mousemove', updateMouse);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMouse);
});
</script>

<template>
  <div class="app-layout">
    <header class="top-navbar">
      <nav class="nav-links">
        <a v-for="link in navLinks" :key="link" href="#" class="nav-item">{{
          link
        }}</a>
      </nav>
      <div class="nav-logo">
        <span class="logo-icon"></span>
      </div>
    </header>

    <div class="main-content">
      <aside class="left-column">
        <div class="sidebar-header">
          <ProfileSidebar />
        </div>
        <div class="sidebar-body">
          <BioSection />
        </div>
      </aside>

      <main class="right-column">
        <GallerySection />
      </main>
    </div>
  </div>
</template>

<style>
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
}

@property --x {
  syntax: '<length-percentage>';
  initial-value: 50vw;
  inherits: true;
}

@property --y {
  syntax: '<length-percentage>';
  initial-value: 50vh;
  inherits: true;
}

@property --mx {
  syntax: '<length-percentage>';
  initial-value: 50vw;
  inherits: true;
}

@property --my {
  syntax: '<length-percentage>';
  initial-value: 50vh;
  inherits: true;
}

@property --ix {
  syntax: '<length-percentage>';
  initial-value: 50%;
  inherits: true;
}

@property --iy {
  syntax: '<length-percentage>';
  initial-value: 50%;
  inherits: true;
}

@keyframes drift {
  0% { --ix: 20%; --iy: 20%; }
  30% { --ix: 80%; --iy: 20%; }
  60% { --ix: 50%; --iy: 80%; }
  100% { --ix: 20%; --iy: 20%; }
}



.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  border: 4px solid black;
}

.top-navbar {
  height: 60px;
  border-bottom: 4px solid black;
  display: flex;
  background: black;
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
  color: white;
  font-weight: 800;
  font-size: 1.2rem;
  text-transform: uppercase;
  border-right: 2px solid #333;
  transition: background 0.2s, color 0.2s;
}

.nav-item:hover {
  background: #222;
  color: #06b6d4;
}

.nav-logo {
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
  border-left: 2px solid #333;
}

.logo-icon {
  font-weight: 900;
  color: white;
  font-size: 2rem;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-column {
  flex: 0 0 600px;
  display: flex;
  flex-direction: column;
  border-right: 4px solid black;
}

.sidebar-header {
  background: #00b5ec;
  transition: .35s cubic-bezier(.1,0,.5,1.5);
  transition-property: --x, --y;
  padding: 2rem;
  border-bottom: 4px solid black;
  position: relative;
  overflow: hidden;
  
  animation: drift 10s infinite ease-in-out;
  --x: var(--ix);
  --y: var(--iy);
}

.sidebar-header:hover {
  --x: var(--mx);
  --y: var(--my);
}

.sidebar-header::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  
  --pattern: radial-gradient(closest-side, #777, #fff) 0/ 1em 1em space;
  --map: radial-gradient(circle farthest-corner at var(--x) var(--y), #888, #fff);
  
  background: var(--pattern), var(--map);
  background-blend-mode: multiply;
  
  mix-blend-mode: screen;
  filter: contrast(16) invert(1);
  opacity: 0.6;
}

.sidebar-header > * {
  position: relative;
  z-index: 1;
}

.sidebar-body {
  flex: 1;
  background: white;
  padding: 2rem;
  overflow-y: auto;
}

.right-column {
  flex: 1;
  background: white;
  overflow-y: auto;
}
</style>
