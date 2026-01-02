<script setup>
import { ref } from "vue";
import PostModal from "./modals/PostModal.vue";

const navLinks = ["Bluesky", "link", "link", "link"];

const posts = [
  {
    id: 1,
    date: "TODAY 4:20 PM",
    mood: "MOOD",
    text: "uuhhh idk",
    likes: 1,
    replies: 0,
    comments: [],
  },
  {
    id: 2,
    date: "YESTERDAY",
    mood: "WIP",
    moodColor: "#64748b",
    moodBg: "#f1f5f9",
    text: "working on that new commission, will post soon...",
    likes: 12,
    replies: 3,
    comments: [
      {
        user: "person",
        text: "uhhh",
      },
      {
        user: "person2",
        text: "life is roblos",
      }
    ],
  },
];

const selectedPost = ref(null);

const openPost = (post) => {
  selectedPost.value = post;
  console.log(selectedPost);
};

const closePost = () => {
  selectedPost.value = null;
};
</script>

<template>
  <div class="bio-container">
    <nav class="links-nav">
      <a v-for="link in navLinks" :key="link" href="#" class="nav-link">
        {{ link }}
      </a>
    </nav>

    <div class="bio-content">
      <h2 class="section-label">BIO</h2>
      <p class="bio-text">big bio uhhh</p>
    </div>

    <div class="blog-section">
      <div class="blog-header">
        <span class="blog-title">UPDATES</span>
        <div class="blog-line"></div>
      </div>

      <div
        v-for="post in posts"
        :key="post.id"
        class="blog-entry"
        @click="openPost(post)"
        :style="{ marginTop: post.id > 1 ? '1rem' : '0' }"
      >
        <div class="entry-meta">
          <span class="entry-date">{{ post.date }}</span>
          <div
            class="entry-badge"
            :style="{
              background: post.moodBg || '#e0f2fe',
              color: post.moodColor || '#0284c7',
            }"
          >
            {{ post.mood }}
          </div>
        </div>
        <p class="entry-text">
          {{ post.text }}
        </p>
        <div class="entry-actions">
          <div class="action-btn">
            <div class="i-mdi-heart-outline"></div>
            <span>{{ post.likes }}</span>
          </div>
          <div class="action-btn">
            <div class="i-mdi-message-outline"></div>
            <span>{{
              post.replies ? "Reply (" + post.replies + ")" : "Reply"
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <PostModal :post="selectedPost" @close="closePost" />
  </div>
</template>

<style scoped>
.bio-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.links-nav {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 1.5rem;
}

.nav-link {
  color: #0f172a;
  text-decoration: none;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  background: #f1f5f9;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.nav-link:hover {
  background: #06b6d4;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(6, 182, 212, 0.2);
}

.section-label {
  font-family: "Outfit", sans-serif;
  font-weight: 800;
  font-size: 2rem;
  color: #0f172a;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.bio-text {
  color: #334155;
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
  color: #94a3b8;
  letter-spacing: 0.1em;
}

.blog-line {
  flex: 1;
  height: 2px;
  background: #f1f5f9;
}

.blog-entry {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
  cursor: pointer;
}

.blog-entry:hover {
  border-color: #06b6d4;
  background: white;
  transform: translateX(4px);
  box-shadow: -4px 4px 0px 0px #06b6d4;
}

.entry-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-family: "Outfit", sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  color: #94a3b8;
}

.entry-badge {
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.entry-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.entry-actions {
  display: flex;
  gap: 1.5rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.2s;
}

.action-btn:hover {
  color: #06b6d4;
}
</style>
