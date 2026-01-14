<script setup>
import { ref, onMounted } from "vue";
import { fetchProjects, createProject, deleteProject, isUserAdmin } from "@/utils/api";
import { getEmojiHtml } from "@/utils/emoji";
import NewProjectModal from "@/components/modals/NewProjectModal.vue";

const projects = ref([]);
const showAddModal = ref(false);

onMounted(async () => {
    await loadProjects();
});

async function loadProjects() {
    try {
        projects.value = await fetchProjects();
    } catch (e) {
        console.error(e);
    }
}

async function handleCreateProject(projectData) {
    try {
        await createProject(projectData);
        showAddModal.value = false;
        await loadProjects();
    } catch (e) {
        alert("Failed to create project");
    }
}

async function handleDeleteProject(id) {
    if (confirm("Delete this project?")) {
        try {
            await deleteProject(id);
            await loadProjects();
        } catch (e) {
            alert("Failed to delete project");
        }
    }
}
</script>

<template>
    <div class="projects-view">
        <div class="header-section">
            <div class="header-top">
                <h1 class="page-title">Projects</h1>
                <button v-if="isUserAdmin" class="add-btn" @click="showAddModal = true">
                    + NEW PROJECT
                </button>
            </div>
            <div class="header-line"></div>
        </div>

        <NewProjectModal :show="showAddModal" @close="showAddModal = false" @create="handleCreateProject" />

        <div class="projects-container">
            <div v-for="(project, index) in projects" :key="index" class="project-item">
                <div class="project-image-wrapper">
                    <div class="img-box">
                        <a :href="project.link" target="_blank" rel="noopener">
                            <img :src="project.image" :alt="project.title" class="project-img" />
                        </a>
                    </div>
                </div>

                <div class="project-content">
                    <div class="content-header">
                        <div class="title-row">
                            <a :href="project.link" target="_blank" class="project-link">
                                <h2 class="project-title" v-html="getEmojiHtml(project.title)"></h2>
                            </a>
                            <button v-if="isUserAdmin" class="delete-btn" @click="handleDeleteProject(project.id)">
                                TRASH
                            </button>
                        </div>
                        <div class="title-underline"></div>
                    </div>
                    <p class="project-desc" v-html="getEmojiHtml(project.description)"></p>
                </div>
            </div>
            <div class="section-divider"></div>
        </div>
    </div>
</template>

<style scoped>
.projects-view {
    padding: 3rem;
    max-width: 1400px;
    margin: 0 auto;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    gap: 3rem;
}

.header-section {
    margin-bottom: 2rem;
}

.page-title {
    font-size: 4rem;
    font-weight: 1000;
    text-transform: uppercase;
    line-height: 0.8;
    margin-bottom: 1rem;
}

.header-line {
    height: 5px;
    background: var(--text-primary);
    width: 100%;
}

.projects-container {
    display: flex;
    flex-direction: column;
}

.project-item {
    display: flex;
    gap: 3rem;
    padding: 3rem 0;
    border-top: 2px solid var(--border-color);
    align-items: flex-start;
}

.project-item:first-child {
    border-top: 4px solid var(--border-color);
}

.project-image-wrapper {
    flex: 0 0 300px;
}

.img-box {
    width: 100%;
    aspect-ratio: 4/3;
    background: var(--bg-card);
    border: 4px solid var(--border-color);
    box-shadow: 8px 8px 0px 0px var(--border-color);
    overflow: hidden;
    transition: transform 0.3s ease;
}

.project-item:hover .img-box {
    transform: translate(-4px, -4px);
    box-shadow: 12px 12px 0px 0px var(--border-color);
}

.project-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.project-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 0.5rem;
}

.project-title {
    font-size: 2.5rem;
    font-weight: 1000;
    text-transform: uppercase;
    line-height: 1;
}

.title-underline {
    height: 4px;
    width: 100px;
    background: var(--accent);
    margin-top: 0.5rem;
}

.project-desc {
    font-size: 1.4rem;
    color: var(--text-secondary);
    font-weight: 600;
    line-height: 1.4;
    max-width: 800px;
}

.section-divider {
    border-top: 4px solid var(--border-color);
    width: 100%;
}

@media (max-width: 900px) {
    .projects-view {
        padding: 1.5rem;
    }

    .project-item {
        flex-direction: column;
        gap: 1.5rem;
    }

    .project-image-wrapper {
        flex: 0 0 auto;
        width: 100%;
        max-width: 400px;
    }
}

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.add-btn {
    background: var(--accent);
    color: white;
    border: 3px solid var(--border-color);
    padding: 0.5rem 1rem;
    font-weight: 900;
    cursor: pointer;
    text-transform: uppercase;
}

.add-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    background: var(--bg-card);
    border: 3px solid var(--border-color);
    margin-bottom: 2rem;
    max-width: 600px;
}

.input-field {
    padding: 0.8rem;
    border: 2px solid var(--border-color);
    background: var(--bg-card-alt);
    font-size: 1rem;
    color: var(--text-primary);
}

.textarea {
    min-height: 100px;
    resize: vertical;
}

.submit-btn {
    background: var(--text-primary);
    color: var(--bg-card);
    border: none;
    padding: 1rem;
    font-weight: 900;
    cursor: pointer;
    text-transform: uppercase;
}

.title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.delete-btn {
    background: #ef4444;
    color: white;
    border: 2px solid var(--border-color);
    padding: 0.3rem 0.6rem;
    font-weight: 900;
    text-transform: uppercase;
    font-size: 0.8rem;
    cursor: pointer;
}

.project-link {
    text-decoration: none;
    color: inherit;
    transition: color 0.2s;
}

.project-link:hover {
    color: var(--accent);
}
</style>
