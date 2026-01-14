<script setup>
import { ref } from 'vue';
import { getRelativeTime } from "../../utils/time";
import { likePost, addPostComment, deletePostComment, likePostComment, deletePost, isUserAdmin } from "../../utils/api";
import { parseMessage, getEmojiHtml } from "../../utils/emoji";
import snarkdown from 'snarkdown';

const props = defineProps({
    post: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(["close", "edit", "deleted"]);

const showReply = ref(false);
const replyText = ref("");
const replyName = ref("");
const isSubmitting = ref(false);

async function handleLike() {
    if (!props.post) return;
    try {
        const updated = await likePost(props.post.id);
        props.post.likes = updated.likes;
        props.post.liked = updated.liked;
    } catch (e) {
        console.error("Failed to toggle like", e);
    }
}

async function handleReply() {
    if (!replyText.value.trim()) return;
    isSubmitting.value = true;
    try {
        const newComment = await addPostComment(props.post.id, replyText.value, replyName.value || 'Visitor');
        if (!props.post.comments) props.post.comments = [];
        newComment.liked = false;
        props.post.comments.push(newComment);
        replyText.value = "";
        showReply.value = false;
    } catch (e) {
        console.error("Failed to reply", e);
        alert("Failed to send reply.");
    } finally {
        isSubmitting.value = false;
    }
}

async function handleLikeComment(comment) {
    try {
        const updated = await likePostComment(comment.id);
        comment.likes = updated.likes;
        comment.liked = updated.liked;
    } catch (e) {
        console.error("Failed to like comment", e);
    }
}

async function handleDeleteComment(commentId) {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
        await deletePostComment(commentId);
        props.post.comments = props.post.comments.filter(c => c.id !== commentId);
    } catch (e) {
        console.error("Failed to delete comment", e);
        alert("Failed to delete comment (you can only delete your own or if you are admin)");
    }
}

function parseMarkdown(text) {
    if (!text) return '';
    return snarkdown(getEmojiHtml(text).replace(/\n/g, '\n\n'));
}

async function handleDeletePost() {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
        await deletePost(props.post.id);
        emit('deleted');
        emit('close');
    } catch (e) {
        console.error("Failed to delete post", e);
        alert("Failed to delete post");
    }
}

function handleEditPost() {
    emit('edit', props.post);
}
</script>

<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="post"
                class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-100 p-8"
                @click.self="$emit('close')">
                <div
                    class="relative post-modal w-full max-w-550px bg-[var(--bg-card)] rounded-2xl overflow-hidden max-h-[85vh] overflow-y-auto flex flex-col animate-pop">
                    <div class="relative bg-[var(--accent)] px-5 py-3 flex items-center justify-between">
                        <div class="flex items-center gap-3 text-white">
                            <div class="bg-black/20 w-8 h-8 rounded-full flex items-center justify-center">
                                <span class="i-mdi-note-text-outline text-xl">
                                </span>
                            </div>
                            <span class="font-display font-900 text-lg tracking-wider">
                                UPDATE
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <button v-if="isUserAdmin"
                                class="neo-close-btn w-8 h-8 flex items-center justify-center rounded-lg bg-black/20 hover:bg-black/40 transition-colors text-white"
                                @click="handleEditPost" title="Edit">
                                <span class="i-mdi-pencil text-lg"></span>
                            </button>
                            <button v-if="isUserAdmin"
                                class="neo-close-btn w-8 h-8 flex items-center justify-center rounded-lg bg-black/20 hover:bg-black/40 transition-colors text-white"
                                @click="handleDeletePost" title="Delete">
                                <span class="i-mdi-delete text-lg"></span>
                            </button>
                            <button
                                class="neo-close-btn w-8 h-8 flex items-center justify-center rounded-lg bg-black/20 hover:bg-black/40 transition-colors text-white"
                                @click="$emit('close')">
                                <span class="i-mdi-close text-lg"></span>
                            </button>
                        </div>

                        <div class="header-divider"></div>
                    </div>

                    <div class="p-6 overflow-y-auto flex-1">
                        <div class="flex gap-2 font-display text-xs font-bold mb-3 opacity-90 items-center">
                            <span class="text-[var(--text-secondary)]"> {{ getRelativeTime(post.date) }} </span>
                            <span v-if="post.pinned" class="i-mdi-pin text-[var(--accent)]" title="Pinned"></span>
                            <span class="text-[var(--text-secondary)]">::</span>
                            <span class="text-[var(--accent)] uppercase"> {{ post.mood }}</span>
                        </div>

                        <div v-if="post.title" class="text-2xl font-bold text-[var(--text-primary)] mb-4 font-display"
                            v-html="getEmojiHtml(post.title)">
                        </div>

                        <div class="text-xl font-medium leading-snug text-[var(--text-primary)] mb-6 markdown-body"
                            v-html="parseMarkdown(post.text)">
                        </div>

                        <div
                            class="bg-[var(--bg-card-alt)] rounded-xl p-4 border border-[var(--border-color)] border-solid shadow-sm mb-4">
                            <div
                                class="font-display font-800 font-xs text-[var(--text-muted)] mb-3 tracking-widest uppercase opacity-70">
                                Comments
                            </div>
                            <div v-if="post.comments && post.comments.length > 0" class="space-y-3">
                                <div v-for="(comment, idx) in post.comments" :key="idx"
                                    class="flex gap-3 mb-3 last:mb-0 group">
                                    <div
                                        class="w-8 h-8 bg-[color-mix(in_srgb,var(--text-muted),transparent_60%)] rounded-full border border-[var(--border-color)] shadow-sm shrink-0">
                                        <img src="/placeholder.webp" class="w-full h-full rounded-full object-cover">
                                    </div>

                                    <div
                                        class="bg-[var(--bg-card)] p-3 rounded-lg shadow-sm border border-[var(--border-color)] flex-1 relative">
                                        <div class="flex justify-between items-start mb-1">
                                            <div
                                                class="text-xs font-bold text-[var(--text-muted)] flex items-center gap-2">
                                                <span class="text-[var(--text-primary)]">{{ comment.user }}</span>
                                                <span
                                                    class="w-1 h-1 rounded-full bg-[var(--text-muted)] opacity-50"></span>
                                                <span class="font-normal opacity-70">{{ getRelativeTime(comment.time)
                                                }}</span>
                                            </div>
                                            <button
                                                class="bg-transparent border-none p-0 cursor-pointer text-[var(--text-secondary)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-60 hover:!opacity-100"
                                                title="Delete" @click.stop="handleDeleteComment(comment.id)">
                                                <span class="i-mdi-trash-can-outline text-sm block"></span>
                                            </button>
                                        </div>

                                        <div
                                            class="text-sm font-medium text-[var(--text-primary)] leading-snug mb-2 pl-0.5 flex flex-wrap items-center gap-0.5">
                                            <template v-for="(token, tIdx) in parseMessage(comment.text)" :key="tIdx">
                                                <span v-if="token.type === 'text'">{{ token.content }}</span>
                                                <img v-else :src="token.src" :alt="token.alt"
                                                    class="w-5 h-5 inline-block" />
                                            </template>
                                        </div>

                                        <div class="flex items-center justify-end">
                                            <button
                                                class="bg-transparent border-none p-0 cursor-pointer flex items-center gap-1.5 transition-colors text-xs font-bold"
                                                :class="comment.liked ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'"
                                                @click="handleLikeComment(comment)">
                                                <span :class="comment.liked ? 'i-mdi-heart' : 'i-mdi-heart-outline'"
                                                    class="text-sm"></span>
                                                {{ comment.likes || 0 }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-[var(--text-secondary)] font-mono text-xs opacity-60">
                                // No comments yet...
                            </div>
                        </div>

                        <div v-if="showReply"
                            class="bg-[var(--bg-card-alt)] rounded-xl p-3 border border-[var(--border-color)] mt-3 reply-enter-active">
                            <div class="flex flex-col gap-2">
                                <input v-model="replyName" placeholder="Name (optional)"
                                    class="neo-input text-sm py-2" />
                                <textarea v-model="replyText" placeholder="Write a reply..."
                                    class="neo-input min-h-16 text-sm py-2" />
                                <div class="flex justify-end gap-2">
                                    <button class="neo-btn-sm text-xs" @click="showReply = false">Cancel</button>
                                    <button class="neo-btn-primary-sm text-xs" @click="handleReply"
                                        :disabled="isSubmitting">
                                        {{ isSubmitting ? 'Posting...' : 'Post Reply' }}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="p-3 px-5 bg-[var(--bg-card-alt)] border-t border-[var(--border-color)] flex gap-3">
                        <button class="neo-btn-primary transition-colors"
                            :class="{ '!bg-[var(--bg-card)] !text-[var(--accent)] !border-[var(--accent)]': post.liked }"
                            @click="handleLike">
                            <span :class="post.liked ? 'i-mdi-heart' : 'i-mdi-heart-outline'"
                                class="text-lg mr-1"></span>
                            {{ post.liked ? 'Unlike' : 'Like' }} <span class="ml-1 opacity-80 text-sm">({{ post.likes ||
                                0 }})</span>
                        </button>
                        <button class="neo-btn" @click="showReply = !showReply">
                            <span class="i-mdi-reply text-lg mr-1">
                            </span>
                            Reply
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.15s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.post-modal {
    border: 4px solid var(--border-color);
    box-shadow: 8px 8px 0 var(--border-color);
    transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.header-divider {
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--border-color);
}

.animate-pop {
    animation: modal-pop 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
}

@keyframes modal-pop {
    0% {
        transform: scale(0.96) translateY(5px);
        opacity: 0;
    }

    100% {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

.reply-enter-active {
    animation: reply-slide 0.2s ease-out;
}

@keyframes reply-slide {
    0% {
        opacity: 0;
        transform: translateY(-5px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.neo-input {
    background: var(--bg-card);
    border: 2px solid var(--border-color);
    padding: 0.5rem;
    border-radius: 6px;
    font-family: 'Outfit', sans-serif;
    width: 100%;
    outline: none;
    color: var(--text-primary);
    transition: border-color 0.2s;
    resize: vertical;
}

.neo-input:focus {
    border-color: var(--accent);
}

.neo-btn-sm {
    background: var(--bg-card);
    border: 2px solid var(--border-color);
    color: var(--text-primary);
    padding: 0.3rem 0.8rem;
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
    padding: 0.3rem 0.8rem;
    border-radius: 6px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.1s;
}

.neo-btn-primary-sm:active {
    transform: translateY(2px);
}

.markdown-body :deep(p) {
    margin-bottom: 0.5rem;
}

.markdown-body :deep(a) {
    color: var(--accent);
    text-decoration: underline;
    padding: unset;
}

.markdown-body :deep(strong) {
    font-weight: 800;
}

.markdown-body :deep(em) {
    font-style: italic;
}

.markdown-body :deep(ul) {
    padding-left: 2rem;
}
</style>
