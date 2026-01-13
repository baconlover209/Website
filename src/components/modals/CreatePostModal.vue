<script setup>
import { ref } from 'vue';
import { createPost, updatePost } from "../../utils/api";

const props = defineProps({
    post: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['close', 'created', 'updated']);

const form = ref({
    title: props.post?.title || '',
    text: props.post?.text || '',
    mood: props.post?.mood || '',
    moodColor: props.post?.moodColor || '#0369a1',
    moodBg: props.post?.moodBg || '',
    pinned: props.post?.pinned || false
});

const isEditing = !!props.post;
const isSubmitting = ref(false);

async function handleSubmit() {
    if (!form.value.text || !form.value.mood) return;

    isSubmitting.value = true;
    try {
        if (isEditing) {
            await updatePost(props.post.id, form.value);
            emit('updated');
        } else {
            await createPost(form.value);
            emit('created');
        }
        emit('close');
    } catch (e) {
        console.error(e);
        alert(isEditing ? 'Failed to update post' : 'Failed to create post');
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<template>
    <Teleport to="body">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4"
            @click.self="$emit('close')">
            <div
                class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div
                    class="p-4 border-b border-[var(--border-color)] bg-[var(--bg-card-alt)] flex justify-between items-center">
                    <h2 class="text-lg font-display font-bold text-[var(--text-primary)]">{{ isEditing ? 'Edit Post' :
                        'New Post' }}</h2>
                    <button @click="$emit('close')"
                        class="text-[var(--text-secondary)] hover:text-white transition-colors">
                        <span class="i-mdi-close text-xl"></span>
                    </button>
                </div>

                <div class="p-6 flex-1 overflow-y-auto flex flex-col gap-4">
                    <div class="flex flex-col gap-1">
                        <label class="text-xs font-bold text-[var(--text-secondary)] uppercase">Title</label>
                        <input v-model="form.title" placeholder="Post Title" class="neo-input" />
                    </div>

                    <div class="flex flex-col gap-1">
                        <label class="text-xs font-bold text-[var(--text-secondary)] uppercase">Mood</label>
                        <input v-model="form.mood" placeholder="e.g. Happy, Working, Tired" class="neo-input" />
                    </div>

                    <div class="flex flex-col gap-1">
                        <label class="text-xs font-bold text-[var(--text-secondary)] uppercase">Mood Color</label>
                        <div class="flex gap-2">
                            <input type="color" v-model="form.moodColor"
                                class="h-10 w-10 p-0 border-none bg-transparent cursor-pointer rounded overflow-hidden" />
                            <input v-model="form.moodColor" class="neo-input flex-1" />
                        </div>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label class="text-xs font-bold text-[var(--text-secondary)] uppercase">Content
                            (Markdown)</label>
                        <textarea v-model="form.text" placeholder="Write something..."
                            class="neo-input min-h-32 font-mono text-sm resize-none h-40"></textarea>
                        <div class="text-[10px] text-[var(--text-muted)]">
                            Supports **bold**, *italic*, [links](url), etc.
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <input type="checkbox" v-model="form.pinned" id="pinned-check"
                            class="accent-[var(--accent)] w-4 h-4 cursor-pointer" />
                        <label for="pinned-check"
                            class="text-xs font-bold text-[var(--text-secondary)] uppercase cursor-pointer select-none">Pin
                            this post</label>
                    </div>
                </div>

                <div class="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card-alt)] flex justify-end gap-2">
                    <button class="neo-btn-sm" @click="$emit('close')">Cancel</button>
                    <button class="neo-btn-primary-sm" @click="handleSubmit" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post') }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.neo-input {
    background: var(--bg-card);
    border: 2px solid var(--border-color);
    padding: 0.75rem;
    border-radius: 8px;
    font-family: 'Outfit', sans-serif;
    width: 100%;
    outline: none;
    color: var(--text-primary);
    transition: border-color 0.2s;
}

.neo-input:focus {
    border-color: var(--accent);
}

.neo-btn-sm {
    background: var(--bg-card);
    border: 2px solid var(--border-color);
    color: var(--text-primary);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.1s;
}

.neo-btn-sm:active {
    transform: translateY(2px);
}

.neo-btn-primary-sm {
    background: var(--accent);
    color: white;
    border: 2px solid var(--border-color);
    padding: 0.5rem 1.5rem;
    border-radius: 6px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.1s;
}

.neo-btn-primary-sm:active {
    transform: translateY(2px);
}
</style>
