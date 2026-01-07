<script setup>
import { ref } from "vue";

const props = defineProps({
    show: Boolean
});

const emit = defineEmits(['close', 'create']);

const newProject = ref({
    title: "",
    description: "",
    image: "",
    link: ""
});

function handleCreate() {
    emit('create', newProject.value);
    newProject.value = { title: "", description: "", image: "", link: "" };
}
</script>

<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="show"
                class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-100 p-8"
                @click.self="$emit('close')">
                <div class="relative post-modal w-full max-w-600px bg-[var(--bg-card)] rounded-2xl overflow-hidden flex flex-col animate-pop"
                    @click.stop>
                    <div class="relative bg-[var(--accent)] px-6 py-4 flex items-center justify-between">
                        <div class="flex items-center gap-3 text-white">
                            <div class="bg-black w-10 h-10 rounded-full flex items-center justify-center">
                                <span class="i-mdi-plus-circle-outline text-2xl"></span>
                            </div>
                            <span class="font-display font-900 text-2xl tracking-wider">
                                NEW PROJECT
                            </span>
                        </div>
                        <button class="neo-close-btn" @click="$emit('close')">
                            <span class="i-mdi-close text-2xl"></span>
                        </button>
                        <div class="header-divider"></div>
                    </div>
                    <div class="p-8 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
                        <div class="flex flex-col gap-2">
                            <label
                                class="font-bold font-display uppercase text-xs tracking-widest text-[var(--text-muted)]">Title</label>
                            <input v-model="newProject.title" class="neo-input" placeholder="Project Title" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label
                                class="font-bold font-display uppercase text-xs tracking-widest text-[var(--text-muted)]">Image
                                URL</label>
                            <input v-model="newProject.image" class="neo-input" placeholder="https://..." />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label
                                class="font-bold font-display uppercase text-xs tracking-widest text-[var(--text-muted)]">Link</label>
                            <input v-model="newProject.link" class="neo-input" placeholder="https://..." />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label
                                class="font-bold font-display uppercase text-xs tracking-widest text-[var(--text-muted)]">Description</label>
                            <textarea v-model="newProject.description" class="neo-input min-h-[120px]"
                                placeholder="Project details..."></textarea>
                        </div>
                    </div>
                    <div
                        class="p-4 px-8 bg-[var(--bg-card-alt)] border-t-2 border-[var(--border-color)] flex justify-end gap-4">
                        <button class="neo-cancel-btn" @click="$emit('close')">
                            CANCEL
                        </button>
                        <button class="neo-btn-primary" @click="handleCreate">
                            <span class="i-mdi-check text-xl"></span>
                            CREATE
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.post-modal {
    border: 4px solid #000;
    box-shadow: 12px 12px 0 #000;
}

.header-divider {
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 4px;
    background: #000;
}

.neo-input {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 3px solid var(--border-color);
    background: var(--bg-card-alt);
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    outline: none;
    transition: all 0.2s;
    border-radius: 12px;
}

.neo-input:focus {
    background: var(--bg-card);
    border-color: var(--accent);
    box-shadow: 4px 4px 0 var(--accent);
}

.neo-btn-primary {
    background: var(--text-primary);
    color: var(--bg-card);
    border: 3px solid #000;
    padding: 0.8rem 2rem;
    font-weight: 900;
    text-transform: uppercase;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
    border-radius: 8px;
    box-shadow: 4px 4px 0 #000;
}

.neo-btn-primary:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 #000;
    background: var(--accent);
    color: white;
}

.neo-btn-primary:active {
    transform: translate(0, 0);
    box-shadow: 0 0 0 #000;
}

.neo-cancel-btn {
    background: transparent;
    color: var(--text-muted);
    border: 3px solid transparent;
    padding: 0.8rem 1.5rem;
    font-weight: 800;
    text-transform: uppercase;
    font-size: 0.9rem;
    cursor: pointer;
    transition: color 0.2s;
    border-radius: 8px;
}

.neo-cancel-btn:hover {
    color: var(--text-primary);
    background: rgba(0, 0, 0, 0.05);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.animate-pop {
    animation: modal-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes modal-pop {
    0% {
        transform: scale(0.9) translateY(20px);
        opacity: 0;
    }

    100% {
        transform: scale(1) translateY(0);
    }
}
</style>
