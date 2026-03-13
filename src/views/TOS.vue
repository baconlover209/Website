<script setup>
import HalftoneLayer from "@/components/HalftoneLayer.vue";
import { ref } from "vue";

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
  <div class="tos-view">
    <div class="card-outer tos-card">
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
          <h1 class="title-main">Terms of Service</h1>
        </div>
        <div class="header-line"></div>
      </div>

      <div class="tos-content">
        <section>
          <h2>0. Introduction</h2>
          <p>Throughout this document, the terms <strong>"I," "me," "my,"</strong> and <strong>"the Artist"</strong> refer specifically to <strong>Dart.</strong> All creative decisions and final artwork are produced solely by <strong>Dart.</strong></p>
          <p><strong>Agreement:</strong> By submitting a commission request, the client acknowledges that they are entering into a professional agreement with the Artist.</p>
        </section>

        <section>
          <h2>1. General & Communication</h2>
          <ul>
            <li><strong>Official Channel:</strong> All official project communication, file sharing, and progress tracking will take place within the private client portal on nthungariandart.xyz</li>
            <li><strong>Right to Decline:</strong> I reserve the right to decline any commission request for any reason.</li>
          </ul>
        </section>

        <section>
          <h2>2. Content Boundaries (Will & Won't Draw)</h2>
          <ul>
            <li><strong>Will Draw:</strong> Anthropomorphic characters, objects, buildings, nature, original characters, complex/simple poses, suggestive themes.</li>
            <li><strong>Won't Draw:</strong> Explicit NSFW (pornography, visible genitalia, hardcore sexual acts), hateful or offensive material.</li>
          </ul>
        </section>

        <section>
          <h2>4. Payment & Flexibility</h2>
          <ul>
            <li><strong>Payment Options:</strong> Clients may choose to pay <strong>upfront in full</strong>, or via a <strong>50/50 split</strong> (50% non-refundable deposit to start, 50% upon completion).</li>
            <li><strong>Upfront Sketches:</strong> At my discretion, I may provide preliminary rough sketches before requiring a deposit. Please note that <strong>sketches are not guaranteed</strong> until a commission is officially accepted and invoiced.</li>
            <li><strong>Invoicing:</strong> All payments are processed formally via invoice. This is to ensure protection for both parties.</li>
          </ul>
        </section>

        <section>
          <h2>5. Process & The Queue</h2>
          <ul>
            <li><strong>Tracking:</strong> You can track your project's status (To Do, In Progress, Review, and Done) via the public Queue page on this site.</li>
            <li><strong>Revisions:</strong> Minor tweaks are allowed throughout the process. However major structural changes (e.g. re-drawing poses or outfits) should be requested during the sketch phase. Significant changes requested after line-art is finished may incur additional fees.</li>
          </ul>
        </section>

        <section>
          <h2>6. Cancellation & Refund Policy</h2>
          <ul>
            <li><strong>Artist's Right to Cancel:</strong> I (Dart) reserve the right to cancel a commission at any moment for any reason with full or partial refund.</li>
            <li><strong>Partial Refunds:</strong> If I cancel a project, you will be refunded for <strong>all uncompleted work.</strong>
              <ul>
                <li><em>Example:</em> If I have finished the line-art but decide to cancel before coloring, you will be charged only for the work produced, and refunded the remainder of your payment.</li>
              </ul>
            </li>
            <li><strong>Full Refunds:</strong> I (Dart) may offer a full refund if I believe it is warranted. I am open to communication regarding any kind of refund.</li>
            <li><strong>Client-Initiated Cancellation:</strong> If you choose to cancel, the initial deposit is non-refundable once work has passed the sketch phase.</li>
          </ul>
        </section>

        <section>
          <h2>7. Copyright & Usage</h2>
          <ul>
            <li><strong>Artist Rights:</strong> I retain full copyright over all artwork. I reserve the right to display the art in my portfolio, gallery, and on social media for promotional purposes unless explicitly communicated otherwise.</li>
            <li><strong>Client Rights:</strong> The artwork is for <strong>personal use only.</strong> You may use it for profile pictures, headers, or personal prints.</li>
            <li><strong>Commercial Use:</strong> The artwork may not be sold, used for merchandise, or used by a commercial entity without a separate Commercial Rights Agreement.</li>
            <li><strong>AI & NFT Ban:</strong> Under no circumstances may my artwork be used for NFT minting or fed into AI/Machine Learning image generators.</li>
          </ul>
        </section>

        <section>
          <h2>8. Chargebacks & Disputes</h2>
          <ul>
            <li><strong>Zero Tolerance:</strong> Because I offer a flexible refund policy for uncompleted work, any attempt to initiate a forced chargeback through a bank or PayPal will result in an immediate permanent blacklist. All rights to any provided art will be forfeited.</li>
          </ul>
        </section>

        <section>
          <h2>9. Failure to Comply</h2>
          <ul>
            <li><strong>Violation of Terms:</strong> Any breach of these terms, including but not limited to, unauthorized commercial use, AI scraping, harassment, or filing a false chargeback, will result in an immediate termination of our agreement.</li>
            <li><strong>Forfeiture:</strong> In the event of such a violation, you <strong>forfeit all rights to any artwork produced and all money previously paid.</strong> No refunds will be issued, and you will no longer have permission to use the artwork for any purpose.</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tos-view {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
  font-family: "Outfit", sans-serif;
  max-width: 1000px;
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

.tos-content {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  color: var(--text-primary);
  line-height: 1.6;
}

section h2 {
  font-size: 1.8rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 1rem;
  color: var(--accent);
}

section p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

section ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

section ul li {
  position: relative;
  padding-left: 1.5rem;
  font-size: 1.1rem;
}

section ul li::before {
  content: "✦";
  position: absolute;
  left: 0;
  color: var(--accent);
}

section ul ul {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

section ul ul li {
  font-size: 1rem;
  opacity: 0.9;
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

@media (max-width: 768px) {
  .tos-view {
    padding: 1.5rem;
  }
  .card-outer {
    padding: 1.5rem;
  }
}
</style>
