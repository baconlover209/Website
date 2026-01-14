<script setup>
import { ref, onMounted } from "vue";
import PostModal from "./modals/PostModal.vue";
import CreatePostModal from "./modals/CreatePostModal.vue";
import { fetchPosts, likePost, isUserAdmin } from "@/utils/api";
import { getRelativeTime } from "../utils/time";
import { getEmojiHtml } from "../utils/emoji";
import snarkdown from 'snarkdown';

const navLinks = ["Twitter", "Bluesky", "Kofi", "discord"];
const navLinkUrls = {
  Twitter: "https://twitter.com/ntHungarianDart",
  Bluesky: "https://bsky.app/profile/notHungarianDart.bsky.social",
  Kofi: "https://ko-fi.com/notHungarianDart",
  discord: "https://discord.gg/tjDhxMrF",
};

const posts = ref([]);
const selectedPost = ref(null);
const showCreateModal = ref(false);

const loadPosts = async () => {
  try {
    posts.value = await fetchPosts();
  } catch (e) {
    console.error(e);
  }
};

onMounted(loadPosts);

const openPost = (post) => {
  selectedPost.value = post;
  console.log(selectedPost);
};

const closePost = () => {
  selectedPost.value = null;
};

async function handleLike(e, post) {
  e.stopPropagation();
  try {
    const updated = await likePost(post.id);
    post.likes = updated.likes;
    post.liked = updated.liked;
  } catch (e) {
    console.error(e);
  }
}

function getContrastColor(hexColor) {
  if (!hexColor) return '#ffffff';
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

  return (yiq >= 128) ? '#000000' : '#ffffff';
}

function parseMarkdown(text) {
  if (!text) return '';
  return snarkdown(getEmojiHtml(text).replace(/\n/g, '\n\n'));
}

function handlePostCreated() {
  loadPosts();
}

const postToEdit = ref(null);

function handleEditPost(post) {
  postToEdit.value = post;
  selectedPost.value = null;
  showCreateModal.value = true;
}

function handlePostDeleted() {
  loadPosts();
}

function handleCreateModalClose() {
  showCreateModal.value = false;
  postToEdit.value = null;
}
</script>

<template>
  <div class="bio-container">
    <nav class="links-nav">
      <a v-for="link in navLinks" :key="link" :href="navLinkUrls[link]" class="nav-link">
        {{ link }}
      </a>
    </nav>

    <div class="bio-content">
      <h2 class="section-label">BIO</h2>
      <p class="bio-text">
        Hi! Welcome to my page! I will be posting the occasional update here as
        well as some of my art. Kinda just my space to share stuff<br />
        -Dart
      </p>
    </div>

    <div class="blog-section">
      <div class="blog-header">
        <span class="blog-title">UPDATES</span>
        <div class="blog-line"></div>
        <button v-if="isUserAdmin" class="neo-btn-sm text-xs ml-2" @click="showCreateModal = true">
          <span class="i-mdi-plus mr-1"></span> New
        </button>
      </div>

      <div v-for="post in posts" :key="post.id" class="blog-entry" @click="openPost(post)"
        :style="{ marginTop: post.id > 1 ? '1rem' : '0' }">
        <div class="entry-meta">
          <div class="flex items-center gap-2">
            <span class="entry-date">{{ getRelativeTime(post.date) }}</span>
            <span v-if="post.pinned" class="i-mdi-pin text-[var(--accent)] text-sm" title="Pinned"></span>
          </div>
          <div class="entry-badge" :style="{
            background: post.moodColor || '#0369a1',
            color: getContrastColor(post.moodColor || '#0369a1'),
            border: 'none'
          }">
            {{ post.mood }}
          </div>
        </div>
        <div v-if="post.title" class="text-xl font-bold text-[var(--text-primary)] mb-2 font-display"
          v-html="getEmojiHtml(post.title)">
        </div>
        <div class="entry-actions">
          <div class="action-btn" :class="{ '!text-[var(--accent)]': post.liked }" @click="(e) => handleLike(e, post)">
            <div :class="post.liked ? 'i-mdi-heart' : 'i-mdi-heart-outline'"></div>
            <span>{{ post.likes }}</span>
          </div>
          <div class="action-btn">
            <div class="i-mdi-message-outline"></div>
            <span>{{
              post.comments && post.comments.length > 0
                ? "Reply (" + post.comments.length + ")"
                : "Reply"
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <PostModal :post="selectedPost" @close="closePost" @deleted="handlePostDeleted" @edit="handleEditPost" />
    <CreatePostModal v-if="showCreateModal" :post="postToEdit" @close="handleCreateModalClose"
      @created="handlePostCreated" @updated="handlePostCreated" />
  </div>
</template>

<style scoped>
.bio-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.links-nav {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  border-bottom: 2px solid var(--text-dim);
  padding-bottom: 1.5rem;
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.9rem;
  background: var(--bg-card-alt);
  padding: 0.5rem 2rem;
  border-radius: 8px;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.nav-link:hover {
  background: var(--accent);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}

.section-label {
  font-family: "Outfit", sans-serif;
  font-weight: 800;
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.bio-text {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 1.1rem;
  font-weight: 500;
}

.blog-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.blog-title {
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-secondary);
  letter-spacing: 0.1em;
}

.blog-line {
  flex: 1;
  height: 2px;
  background: var(--bg-card-alt);
}

.blog-entry {
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
  cursor: pointer;
}

.blog-entry:hover {
  border-color: var(--accent);
  background: var(--bg-card-alt);
  transform: translateX(4px);
  box-shadow: -4px 4px 0px 0px var(--accent);
}

.entry-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-family: "Outfit", sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.entry-badge {
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: 0.05em;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.entry-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.entry-actions {
  display: flex;
  gap: 1.5rem;
  border-top: 1px solid var(--text-dim);
  padding-top: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.2s;
}

.action-btn:hover {
  color: var(--accent);
}

.neo-btn-sm {
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.1s;
  display: flex;
  align-items: center;
}

.neo-btn-sm:active {
  transform: translateY(1px);
}

.markdown-body :deep(p) {
  margin-bottom: 0.5rem;
}

.markdown-body :deep(a) {
  color: var(--accent);
  text-decoration: underline;
}

.markdown-body :deep(strong) {
  font-weight: 800;
}

.markdown-body :deep(em) {
  font-style: italic;
}
</style>
