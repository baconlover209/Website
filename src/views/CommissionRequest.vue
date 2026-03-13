<script setup>
import { ref, computed } from "vue";
import { requestCommission } from "@/utils/api";
import HalftoneLayer from "@/components/HalftoneLayer.vue";
import { useRoute } from 'vue-router';

const route = useRoute();
const selectedStyle = ref(route.query.style || "Full");

const pricing = {
  styles: [
    { name: "Sketch", color: "#94a3b8" },
    { name: "Flat", color: "#ffd43b" },
    { name: "Cell", color: "#5ffcfa" },
    { name: "Full", color: "#91e0c2" },
  ],
};

const currentStyleData = computed(() =>
  pricing.styles.find((s) => s.name === selectedStyle.value) || pricing.styles[3]
);

const formData = ref({
  name: "",
  contact: "",
  description: "",
  paymentPlan: "Full",
  agreedToTos: false,
});

const isSubmitting = ref(false);
const submitMessage = ref("");
const submitError = ref("");

const submitRequest = async () => {
  if (!formData.value.agreedToTos) {
    submitError.value = "You must read and agree to the Terms of Service.";
    return;
  }

  isSubmitting.value = true;
  submitMessage.value = "";
  submitError.value = "";

  try {
    const res = await requestCommission({
      ...formData.value,
      style: selectedStyle.value,
    });
    submitMessage.value = res.message || "Request sent successfully!";
    formData.value = { name: "", contact: "", description: "", agreedToTos: false };
  } catch (err) {
    submitError.value = err.message;
  } finally {
    isSubmitting.value = false;
  }
};

const lx = ref("50%");
const ly = ref("50%");
const logoMark = ref(null);

function handleLogoMouse(e) {
  if (!logoMark.value) return;
  const rect = logoMark.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  lx.value = `${x}px`;
  ly.value = `${y}px`;
}
</script>

<template>
  <div class="request-view">
    <div class="card-outer request-card">
      <div class="header-block">
        <div class="header-top">
          <div ref="logoMark" class="logo-mark animated-halftone" @mousemove="handleLogoMouse">
            <HalftoneLayer class="halftone-idle" mode="idle" dot-size="33.33%" />
            <HalftoneLayer class="halftone-hover" mode="mouse" :x="lx" :y="ly" dot-size="33.33%" :use-wave="false"
              :use-gradient="true" />
            <div style="position: relative; z-index: 1">
              <div class="text-3xl text-white"></div>
            </div>
          </div>
          <h1 class="title-main">Commission Request</h1>
        </div>
        <div class="header-line"></div>
      </div>

      <div class="request-layout">
        <div class="form-side">
          <form @submit.prevent="submitRequest" class="request-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Name / Handle</label>
                <input v-model="formData.name" type="text" id="name" placeholder="How should I call you?" required />
              </div>
              <div class="form-group">
                <label for="contact">Contact Information</label>
                <input v-model="formData.contact" type="text" id="contact" placeholder="Discord, Email, etc." required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Selected Style</label>
                <select v-model="selectedStyle" class="style-select">
                  <option v-for="style in pricing.styles" :key="style.name" :value="style.name">
                    {{ style.name }} Style
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>Payment Plan</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input type="radio" v-model="formData.paymentPlan" value="Full" />
                    <span class="radio-btn"></span>
                    <span class="radio-label">Up-front</span>
                  </label>
                  <label class="radio-item">
                    <input type="radio" v-model="formData.paymentPlan" value="50/50" />
                    <span class="radio-btn"></span>
                    <span class="radio-label">50/50</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-group full-width">
              <label for="description">Project Description</label>
              <textarea v-model="formData.description" id="description" rows="6"
                placeholder="Tell me about your character/idea..." required></textarea>
            </div>

            <div class="form-footer">
              <button type="submit" class="submit-btn" :disabled="isSubmitting">
                <span v-if="!isSubmitting">Submit Request</span>
                <span v-else>Sending...</span>
                <div class="btn-shadow"></div>
              </button>
              <transition name="fade">
                <p v-if="submitMessage" class="status-message success">{{ submitMessage }}</p>
                <p v-else-if="submitError" class="status-message error">{{ submitError }}</p>
              </transition>
            </div>
          </form>
        </div>

        <div class="info-side">
          <div class="abridged-tos">
            <h2 class="title-sub">Commission Terms</h2>
            <ul class="tos-list">
              <li><strong>Payment:</strong> Upfront or 50% deposit to start / 50% on completion.</li>
              <li><strong>Content:</strong> Suggestive OK. No explicit NSFW.</li>
              <li><strong>Rights:</strong> Personal use only. No AI training or NFTs.</li>
              <li><strong>Cancellation:</strong> Artist may cancel & refund uncompleted work at any time.</li>
              <li><strong>Penalty:</strong> Violation of these terms = <strong>Forfeit all art and money paid.</strong></li>
            </ul>
            
            <div class="tos-agreement">
              <label class="checkbox-container">
                <input type="checkbox" v-model="formData.agreedToTos" required />
                <span class="checkmark"></span>
                <span class="checkbox-label">
                  I have read and agree to the <router-link to="/tos" class="tos-link">Terms of Service</router-link>.
                  I understand that any violation of these terms results in the immediate forfeiture of all rights to the
                  artwork and any payments made.
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.request-view {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
  font-family: "Outfit", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--bg-main);
  min-height: 100%;
}

.card-outer {
  background: var(--bg-card);
  border: 4px solid var(--border-color);
  box-shadow: 10px 10px 0px 0px var(--border-color);
  position: relative;
  padding: 3rem;
}

.header-block {
  margin-bottom: 3rem;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.logo-mark {
  width: 60px;
  height: 60px;
  background: var(--halftone-bg);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--border-color);
  box-shadow: 4px 4px 0px 0px var(--border-color);
  box-sizing: content-box;
  flex-shrink: 0;
}

.title-main {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
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

.request-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 4rem;
}

.request-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex: 1;
}

.form-row {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.form-row > * {
  flex: 1;
  min-width: 250px;
}

.form-group label {
  font-weight: 900;
  text-transform: uppercase;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.form-group input,
.form-group textarea,
.style-select {
  padding: 1rem;
  border: 4px solid var(--border-color);
  background: var(--bg-card-alt);
  font-family: inherit;
  font-size: 1.1rem;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.style-select {
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
}

.form-group input:focus,
.form-group textarea:focus,
.style-select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 6px 6px 0px 0px var(--accent);
  transform: translate(-3px, -3px);
}

.radio-group {
  display: flex;
  gap: 2rem;
  padding: 0.5rem 0;
  align-items: center;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  user-select: none;
}

.radio-item input {
  display: none;
}

.radio-btn {
  width: 24px;
  height: 24px;
  border: 4px solid var(--border-color);
  background: white;
  position: relative;
  transition: all 0.2s ease;
}

.radio-item:hover .radio-btn {
  border-color: var(--accent);
}

.radio-item input:checked + .radio-btn {
  background: var(--accent);
  border-color: var(--accent);
}

.radio-item input:checked + .radio-btn::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 0;
}

.radio-label {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 1rem;
  color: var(--text-primary);
}

.title-sub {
  font-size: 2rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  color: var(--accent);
}

.tos-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 3rem;
}

.tos-list li {
  position: relative;
  padding-left: 2rem;
  font-size: 1.1rem;
  line-height: 1.4;
}

.tos-list li::before {
  content: "✦";
  position: absolute;
  left: 0;
  color: var(--accent);
  font-weight: 900;
}

.tos-agreement {
  background: var(--bg-card-alt);
  padding: 1.5rem;
  border: 4px solid var(--border-color);
  box-shadow: 6px 6px 0px 0px var(--border-color);
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  display: none;
}

.checkmark {
  width: 28px;
  height: 28px;
  border: 4px solid var(--border-color);
  background: white;
  flex-shrink: 0;
  position: relative;
  transition: all 0.2s ease;
}

.checkbox-container:hover .checkmark {
  border-color: var(--accent);
}

.checkbox-container input:checked + .checkmark {
  background: var(--accent);
  border-color: var(--accent);
}

.checkbox-container input:checked + .checkmark::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: 900;
  font-size: 1.4rem;
}

.checkbox-label {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.4;
}

.tos-link {
  color: var(--accent);
  text-decoration: underline;
  font-weight: 900;
}

.form-footer {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

.submit-btn {
  position: relative;
  padding: 1.2rem 3rem;
  font-weight: 900;
  text-transform: uppercase;
  border: 4px solid var(--border-color);
  background: var(--accent);
  color: white;
  cursor: pointer;
  font-size: 1.4rem;
  transition: all 0.2s ease;
  width: fit-content;
}

.submit-btn:hover:not(:disabled) {
  transform: translate(-6px, -6px);
  filter: brightness(1.1);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn:hover:not(:disabled) .btn-shadow {
  opacity: 1;
  transform: translate(6px, 6px);
  background: black;
}

.btn-shadow {
  position: absolute;
  inset: -4px;
  background: var(--border-color);
  z-index: -1;
  opacity: 0;
  transition: 0.2s;
}

.status-message {
  font-weight: 900;
  text-transform: uppercase;
  font-size: 1.2rem;
}

.status-message.success {
  color: #10b981;
}

.status-message.error {
  color: #ef4444;
}

.animated-halftone {
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

.logo-mark:hover .halftone-idle {
  opacity: 0;
}

.logo-mark:hover .halftone-hover {
  opacity: var(--halftone-opacity);
}

@media (max-width: 1024px) {
  .request-layout {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .info-side {
    order: -1;
  }
}

@media (max-width: 768px) {
  .request-view {
    padding: 1.5rem;
  }
  .card-outer {
    padding: 1.5rem;
  }
}
</style>
