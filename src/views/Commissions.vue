<script setup>
import { ref, computed, onMounted } from "vue";
import { fetchArt } from '@/utils/fetchArt';


const selectedStyle = ref("Cell");

const pricing = {
  styles: [
    { name: "Sketch", color: "#94a3b8", art: "/art/bedrot.webp" },
    { name: "Flat", color: "#60a5fa", art: "/art/fdsdffdfd.webp" },
    { name: "Cell", color: "#00CCFF", art: "/art/limebih.webp" },
    { name: "Full", color: "#f59e0b", art: "/art/wdwdwddwfgghhh.webp" },
  ],
  crops: [
    { name: "Head", basePrice: 5 },
    { name: "Half", basePrice: 10 },
    { name: "Full", basePrice: 15 },
  ],
};

const paintingStack = ref([]);

onMounted(async () => {
    try {
        const data = await fetchArt("comm_flipbook");
        paintingStack.value = data.pieces.map(item => item.img); // Assign the "pieces" array from the JSON
    } catch (error) {
        console.error('Error loading gallery items:', error);
    }
});

const shufflePaintings = () => {
  const top = paintingStack.value.pop();
  paintingStack.value.unshift(top);
};

const getStylePrice = (base) => {
  const multipliers = { Sketch: 0.5, Flat: 1, Cell: 1.5, Full: 2 };
  const price = Math.round(base * multipliers[selectedStyle.value]);
  return `$${price}`;
};

const currentStyleData = computed(() =>
  pricing.styles.find((s) => s.name === selectedStyle.value)
);

const backgrounds = [
  { name: "Simple", price: "Free", img: "/art/EVIL2.webp" },
  { name: "Abstract", price: "$5", img: "/art/sfdfsdsdfsfdfsvdvds.webp" },
  { name: "Scene", price: "$10", img: "/art/2323e.webp" },
];
</script>

<template>
  <div class="commissions-view">
    <div class="card-outer hero-card">
      <div class="hero-layout">
        <div class="art-container">
          <transition name="fade-up" mode="out-in">
            <div
              :key="selectedStyle"
              class="art-box"
              :style="{
                borderColor: currentStyleData.color,
                '--tint': currentStyleData.color,
              }"
            >
              <img
                :src="currentStyleData.art"
                class="art-image"
                :alt="selectedStyle"
              />
              <span class="label-bottom">{{ selectedStyle }} Style</span>
            </div>
          </transition>
        </div>

        <div class="info-container">
          <div class="header-block">
            <div class="header-top">
              <div class="logo-mark animated-halftone">
                <div class="halftone-overlay"></div>
                <div style="position: relative; z-index: 1">
                  <div
                    class="i-mdi-chevron-triple-up text-3xl text-white"
                  ></div>
                </div>
              </div>
              <h1 class="title-main">Commissions</h1>
            </div>
            <div class="header-line"></div>
          </div>

          <div class="pricing-matrix">
            <div class="styles-selector">
              <button
                v-for="style in pricing.styles"
                :key="style.name"
                class="style-btn"
                :class="{ active: selectedStyle === style.name }"
                @click="selectedStyle = style.name"
              >
                {{ style.name }}
                <div class="btn-shadow"></div>
              </button>
            </div>

            <div class="sub-box crops-box">
              <div
                v-for="crop in pricing.crops"
                :key="crop.name"
                class="crop-row"
              >
                <span class="crop-name">{{ crop.name }}</span>
                <span class="crop-separator">—</span>
                <transition name="price-fade" mode="out-in">
                  <span
                    :key="selectedStyle"
                    class="crop-value text-cyan-shine"
                    >{{ getStylePrice(crop.basePrice) }}</span
                  >
                </transition>
              </div>
            </div>
          </div>

          <div class="badge-corner">Per character</div>
        </div>
      </div>
    </div>
    <h class="anim-title">Backgrounds</h>
    <div class="middle-grid">
      <div v-for="bg in backgrounds" :key="bg.name" class="grid-item">
        <div class="item-square hover-subtle">
          <img :src="bg.img" class="grid-img" :alt="bg.name" />
        </div>
        <div class="item-caption">{{ bg.name }} — {{ bg.price }}</div>
      </div>

      <div class="animation-card hover-subtle">
        <h3 class="anim-title">Animation</h3>
        <div class="anim-lines">
          <div class="line">✦ uhh blahh</div>
          <div class="line">✦ 24 FPS or smth</div>
          <div class="line">✦ yuh</div>
        </div>
      </div>
    </div>

    <div class="section-divider"></div>

    <div class="painting-layout">
      <div class="painting-info">
        <h2 class="title-huge text-pop">Painting</h2>
        <div class="painting-details">
          <div class="detail-item">✦ Fully Rendered Illustrations</div>
          <div class="detail-item">✦ Atmospheric Lighting & FX</div>
          <div class="detail-item">✦ High Resolution PNG</div>
          <div class="painting-price">STARTING AT $150</div>
        </div>
        <div class="filler-lines">
          <div class="f-line short"></div>
          <div class="f-line long"></div>
        </div>
      </div>

      <div class="photo-deck" @click="shufflePaintings">
        <transition-group name="deck-flip">
          <div
            v-for="(img, idx) in paintingStack"
            :key="img"
            class="photo-wrap"
            :class="{ 'is-top': idx === paintingStack.length - 1 }"
            :style="{
              zIndex: idx,
              transform: `rotate(${idx * 4 - 4}deg) translateX(${
                idx * 15 - 15
              }px)`,
              pointerEvents: idx === paintingStack.length - 1 ? 'auto' : 'none',
            }"
          >
            <img :src="img" class="spread-img" />
          </div>
        </transition-group>
        <div class="spread-hint">CLICK TO FLIP THROUGH</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.commissions-view {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
  font-family: "Outfit", sans-serif;
  max-width: 1500px;
  margin: 0 auto;
  background: var(--bg-main);
  min-height: 100%;
}

.card-outer {
  background: var(--bg-card);
  border: 4px solid var(--border-color);
  box-shadow: 10px 10px 0px 0px var(--border-color);
  position: relative;
  transition: all 0.3s ease;
}

.hero-layout {
  display: grid;
  grid-template-columns: 420px 1fr;
  padding: 2.5rem;
  gap: 2.5rem;
  min-height: 500px;
}

.art-box {
  width: 100%;
  height: 100%;
  border: 4px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: color-mix(
    in srgb,
    var(--tint, var(--bg-card-alt)) 15%,
    var(--bg-card-alt)
  );
}

.art-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.label-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--border-color);
  color: var(--text-primary);
  padding: 0.6rem;
  text-align: center;
  font-weight: 1000;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
}

.info-container {
  display: flex;
  flex-direction: column;
}

.header-block {
  margin-bottom: 2rem;
}

.title-main {
  font-size: 4rem;
  font-weight: 1000;
  text-transform: uppercase;
  line-height: 0.8;
  letter-spacing: -0.04em;
}

.header-line {
  height: 5px;
  background: var(--text-primary);
  width: 100%;
  margin-top: 1rem;
}

.pricing-matrix {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 1.5rem;
  flex: 1;
}

.styles-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.style-btn {
  position: relative;
  padding: 0.8rem;
  font-weight: 1000;
  text-transform: uppercase;
  border: 3px solid var(--border-color);
  background: var(--bg-card);
  cursor: pointer;
  font-size: 1.05rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.style-btn:hover {
  transform: translate(-3px, -3px);
  background: var(--bg-card-alt);
}

.style-btn:hover .btn-shadow {
  transform: translate(3px, 3px);
  opacity: 1;
}

.btn-shadow {
  position: absolute;
  inset: -3px;
  background: var(--border-color);
  z-index: -1;
  opacity: 0;
  transition: 0.2s;
}

.style-btn.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
  transform: translate(-4px, -4px);
}

.style-btn.active:hover {
  background: var(--accent);
  filter: brightness(1.1);
  border-color: var(--accent);
}

.style-btn.active .btn-shadow {
  opacity: 1;
  transform: translate(4px, 4px);
  background: black;
}

.crops-box {
  background: var(--bg-card-alt);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  border: 4px solid var(--border-color);
}

.crop-row {
  display: grid;
  grid-template-columns: 100px 50px 1fr;
  align-items: center;
  font-size: 2rem;
  font-weight: 1000;
  text-transform: uppercase;
}

.crop-name {
  text-align: left;
}
.crop-separator {
  text-align: center;
  color: var(--text-primary);
}
.crop-value {
  text-align: left;
}

.text-cyan-shine {
  color: var(--accent);
}

.badge-corner {
  position: absolute;
  bottom: -1rem;
  right: -1rem;
  background: var(--bg-card);
  border: 3px solid var(--border-color);
  padding: 0.6rem 1.2rem;
  font-weight: 1000;
  text-transform: uppercase;
  font-size: 0.85rem;
  box-shadow: 6px 6px 0px 0px var(--border-color);
}

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

.item-caption {
  font-weight: 1000;
  text-transform: uppercase;
  font-size: 1.4rem;
  color: var(--text-primary);
}

.animation-card {
  padding: 1.5rem;
  background: var(--bg-card);
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
  container-type: inline-size;
  border: 4px solid var(--border-color);
  box-shadow: 8px 8px 0px 0px var(--border-color);
  transition: all 0.3s ease;
}

.anim-title {
  font-size: clamp(1.2rem, 11cqw, 2.2rem);
  font-weight: 1000;
  text-transform: uppercase;
  margin-bottom: 1.25rem;
  line-height: 1;
  overflow-wrap: break-word;
}

.anim-lines {
  font-weight: 800;
  font-size: 1.2rem;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  overflow-wrap: break-word;
}

.section-divider {
  border-top: 5px dashed var(--border-color);
  margin: 1rem 0;
  opacity: 0.2;
}

.painting-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  padding-bottom: 6rem;
}

.title-huge {
  font-size: 7rem;
  font-weight: 1000;
  text-transform: uppercase;
  line-height: 0.8;
  margin-bottom: 2.5rem;
}

.text-pop {
  color: var(--text-primary);
}

.painting-details {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
}

.painting-price {
  font-size: 2.2rem;
  font-weight: 900;
  color: var(--accent);
  margin-top: 1.25rem;
}

.f-line {
  height: 12px;
  background: var(--text-primary);
  margin-bottom: 1.25rem;
}

.short {
  width: 120px;
}
.long {
  width: 400px;
}

.photo-deck {
  position: relative;
  height: 480px;
  width: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
}

.photo-wrap {
  position: absolute;
  width: 320px;
  height: 400px;
  border: 12px solid white;
  box-shadow: 0 10px 40px -5px rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden;
  background: #eee;
}

.spread-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.photo-wrap.is-top:hover {
  border-color: var(--accent);
  transform: translateY(-20px) !important;
  z-index: 100 !important;
}

.spread-hint {
  position: absolute;
  bottom: -25px;
  font-weight: 1000;
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  color: var(--text-secondary);
  opacity: 1;
}

.deck-flip-leave-active {
  position: absolute;
  z-index: 150 !important;
  animation: flip-out 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  pointer-events: none !important;
}

.deck-flip-enter-active {
  animation: flip-in 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes flip-out {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }
  60% {
    transform: translate(280px, -40px) rotate(15deg);
    opacity: 1;
  }
  100% {
    transform: translate(0, 20px) rotate(0deg);
    opacity: 0.2;
  }
}

@keyframes flip-in {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.price-fade-enter-active,
.price-fade-leave-active {
  transition: all 0.3s ease;
}
.price-fade-enter-from,
.price-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

@media (max-width: 1600px) {
  .hero-layout {
    grid-template-columns: 1fr;
  }
  .pricing-matrix {
    grid-template-columns: 1fr;
  }
  .art-box {
    height: 480px;
  }
  .painting-layout {
    grid-template-columns: 1fr;
    gap: 4rem;
  }
  .photo-deck {
    margin: 0 auto;
  }
}

@media (max-width: 1250px) {
  .middle-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
  }
  .title-huge {
    font-size: 5rem;
  }
  .title-main {
    font-size: 3.5rem;
  }
}

@media (max-width: 850px) {
  .commissions-view {
    padding: 1.5rem;
    gap: 2rem;
  }
  .middle-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .painting-layout {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .title-huge {
    font-size: 4rem;
  }

  .photo-deck {
    width: 100%;
    height: 400px;
    transform: scale(0.9);
  }

  .title-main {
    font-size: 3rem;
  }

  .styles-selector {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .style-btn {
    flex: 1;
    min-width: 100px;
    text-align: center;
  }
}

@media (max-width: 500px) {
  .middle-grid {
    grid-template-columns: 1fr;
  }
  .crop-row {
    font-size: 1.5rem;
    grid-template-columns: 80px 30px 1fr;
  }
  .hero-layout {
    padding: 1.5rem;
  }
  .art-box {
    height: 320px;
  }
  .photo-deck {
    height: 350px;
    transform: scale(0.8);
  }
  .photo-wrap {
    width: 240px;
    height: 300px;
  }
}
</style>
