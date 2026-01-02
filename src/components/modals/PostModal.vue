<script setup>
import { getRelativeTime } from "../../utils/time";

defineProps({
    post: {
        type: Object,
        default: null,
    },
})

defineEmits(["close"]);
</script>

<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="post"
                class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-100 p-8"
                @click.self="$emit('close')">
                <div
                    class="relative post-modal w-full max-w-600px bg-[var(--bg-card)] rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto flex flex-col animate-pop">
                    <div class="relative bg-[var(--accent)] px-6 py-4 flex items-center justify-between">
                        <div class="flex items-center gap-3 text-white">
                            <div class="bg-black w-10 h-10 rounded-full flex items-center justify-center">
                                <span class="i-mdi-note-text-outline text-2xl">
                                </span>
                            </div>
                            <span class="font-display font-900 text-2xl tracking-wider">
                                POST VIEW
                            </span>
                        </div>
                        <button class="neo-close-btn" @click="$emit('close')">
                            <span class="i-mdi-close text-2xl"></span>
                        </button>

                        <div class="header-divider"></div>
                    </div>

                    <div class="p-8 overflow-y-auto flex-1">
                        <div class="flex gap-2 font-display text-sm font-bold mb-2">
                            <span class="text-[var(--text-muted)]"> {{ getRelativeTime(post.date)}} </span>
                            <span class="text-[var(--text-muted)]">::</span>
                            <span class="text-[var(--accent)] uppercase"> {{ post.mood }}</span>
                        </div>

                        <div class="text-2xl font-600 leading-snug text-[var(--text-primary)] mb-6">
                            {{ post.text }}
                        </div>

                        <div class="bg-[var(--bg-card-alt)] rounded-xl p-6 border-2 border-[var(--text-dim)] border-solid shadow-sm">
                            <div class="font-display font-800 font-xs text-[var(--text-muted)] mb-4 tracking-widest">
                                COMMENTS_FEED
                            </div>
                            <div v-if="post.comments && post.comments.length > 0" class="space-y-4">
                                <div v-for="(comment, idx) in post.comments" :key="idx"
                                    class="flex gap-4 mb-4 last:mb-0">
                                    <div
                                        class="w-8 h-8 bg-[var(--text-muted)] rounded-full border-2 border-[var(--border-color)] shadow-sm shrink-0 opacity-40">
                                    </div>

                                    <div class="bg-[var(--bg-card)] p-3 px-4 rounded-tr-xl rounded-b-xl shadow-sm border border-[var(--text-dim)] border-opacity-20">
                                        <div class="text-xs font-800 text-[var(--text-muted)] mb-1">
                                            {{ comment.user }}
                                        </div>
                                        <div class="text-xs font-800 text-[var(--text-primary)] mb-1">
                                            {{ comment.text }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-slate-400 font-mono text-sm">
                                // No comments yet...
                            </div>
                        </div>
                    </div>
                    <div class="p-4 px-8 bg-[var(--bg-card-alt)] border-t-2 border-[var(--border-color)] flex gap-4">
                        <button class="neo-btn-primary">
                            <span class="i-mdi-heart text-xl">
                            </span>
                            Like
                        </button>
                        <button class="neo-btn">
                            <span class="i-mdi-reply text-xl">
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
    transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

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