<script setup>
import { ref, onMounted } from 'vue';

const isDark = ref(false);

const toggleTheme = () => {
    isDark.value = !isDark.value;
    if (isDark.value) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
};

onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        isDark.value = true;
        document.documentElement.classList.add('dark');
    }
});
</script>

<template>
    <button 
        @click="toggleTheme" 
        class="theme-toggle-btn"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    >
        <div class="icon-wrapper">
            <Transition name="icon-alt" mode="out-in">
                <div v-if="isDark" key="moon" class="i-mdi-moon-waning-crescent text-2xl text-cyan-400"></div>
                <div v-else key="sun" class="i-mdi-white-balance-sunny text-2xl text-orange-400"></div>
            </Transition>
        </div>
        <div class="toggle-track">
            <div class="toggle-thumb" :class="{ 'is-dark': isDark }"></div>
        </div>
    </button>
</template>

<style scoped>
.theme-toggle-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.5rem;
    transition: all 0.2s;
}

.icon-wrapper {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toggle-track {
    width: 50px;
    height: 26px;
    background: #333;
    border: 2px solid #555;
    border-radius: 20px;
    position: relative;
    transition: all 0.3s;
}

.dark .toggle-track {
    background: #06b6d4;
    border-color: #0891b2;
}

.toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.toggle-thumb.is-dark {
    left: 26px;
    background: #000;
}

.icon-alt-enter-active,
.icon-alt-leave-active {
  transition: all 0.25s ease;
}

.icon-alt-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(-90deg);
}

.icon-alt-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(90deg);
}

.theme-toggle-btn:hover .toggle-track {
    border-color: #eee;
}

.dark .theme-toggle-btn:hover .toggle-track {
    border-color: white;
}
</style>
