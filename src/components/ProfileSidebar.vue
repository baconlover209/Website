<script setup>
import avatarUrl from "../assets/pfp_optimized.gif";
</script>

<template>
  <div class="profile-container">
    <div class="identity-wrapper">
      <div class="avatar-frame">
        <img :src="avatarUrl" class="avatar-img" />
      </div>
      <h1 class="name-title">DART</h1>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.identity-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.avatar-frame {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 6px solid white;
  background: white;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name-title {
  font-family: "Outfit", sans-serif;
  font-weight: 900;
  font-size: 3rem;
  letter-spacing: -0.05em;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
  margin: 0;
  color: white !important;
}
</style>
