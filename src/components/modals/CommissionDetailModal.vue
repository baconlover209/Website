<script setup>
import { ref } from "vue";

const props = defineProps({
    show: Boolean,
    commission: Object,
    isAdmin: Boolean,
    canComment: Boolean
});

const emit = defineEmits(["close", "add-comment", "update-status", "delete-commission", "delete-log", "archive-commission"]);

const newComment = ref("");

function formatPrice(p) {
    return "$" + p;
}

function handleArchiveCommission() {
    if (confirm("Archive this commission?")) {
        emit('archive-commission', props.commission.id);
    }
}

function handleDeleteCommission() {
    if (confirm("Are you sure you want to delete this commission?")) {
        emit('delete-commission', props.commission.id);
    }
}

function handleDeleteLog(index) {
    emit('delete-log', index);
}

function handleAddComment() {
    if (!newComment.value.trim()) return;
    emit("add-comment", newComment.value);
    newComment.value = "";
}

function handlePaidChange(evt) {
    emit('update-status', { paid: evt.target.value === 'true' });
}

function handlePrivateChange(evt) {
    emit('update-status', { isPrivate: evt.target.checked });
}

function getClientLink(comm) {
    if (!comm.accessKey) return "No Key";
    const origin = window.location.origin;
    return `${origin}/queue?id=${comm.id}&key=${comm.accessKey}`;
}

function copyLink(comm) {
    const link = getClientLink(comm);
    navigator.clipboard.writeText(link).then(() => {
        alert("Link copied to clipboard!");
    });
}
</script>

<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="show && commission" class="modal-overlay" @click.self="emit('close')">
                <div class="modal-card detail-card">
                    <div class="detail-header">
                        <div>
                            <h2 class="modal-title detail-title">{{ commission.client }}</h2>
                            <div class="detail-meta">
                                <span class="meta-tag">{{ commission.type }}</span>
                                <span class="meta-tag">{{ formatPrice(commission.price) }}</span>
                                <span v-if="commission.contact && (isAdmin || canComment)" class="meta-tag contact">{{
                                    commission.contact }}</span>
                                <div v-if="isAdmin" class="action-buttons">
                                    <button class="archive-btn" @click="handleArchiveCommission">ARCHIVE</button>
                                    <button class="delete-btn" @click="handleDeleteCommission">TRASH</button>
                                </div>
                            </div>
                        </div>
                        <button class="close-btn" @click="emit('close')">✕</button>
                    </div>

                    <div class="detail-body">
                        <div class="detail-main">
                            <div v-if="commission.desc" class="section">
                                <h3 class="section-headers">Description</h3>
                                <p class="detail-desc">{{ commission.desc }}</p>
                            </div>

                            <div class="section">
                                <h3 class="section-headers">Activity Log</h3>
                                <div class="log-list">
                                    <div v-for="(log, i) in commission.logs" :key="i" class="log-item">
                                        <div class="log-content">
                                            <span class="log-time">{{ log.time }}</span>
                                            <span class="log-text">{{ log.text }}</span>
                                        </div>
                                        <button v-if="isAdmin" class="log-delete" @click="handleDeleteLog(i)">×</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="detail-sidebar">
                            <div class="section">
                                <h3 class="section-headers">Status</h3>
                                <div v-if="isAdmin">
                                    <select :value="commission.paid" @change="handlePaidChange"
                                        class="input-field small-select">
                                        <option :value="true">Paid</option>
                                        <option :value="false">Unpaid</option>
                                    </select>
                                </div>
                                <div v-else-if="!commission.isPrivate || canComment" class="status-text-display"
                                    :class="{ 'is-paid': commission.paid, 'is-unpaid': !commission.paid }">
                                    {{ commission.paid ? 'PAID' : 'UNPAID' }}
                                </div>

                                <div v-if="isAdmin" class="form-group checkbox-group">
                                    <input :checked="commission.isPrivate" @change="handlePrivateChange" type="checkbox"
                                        id="detailPrivate" />
                                    <label for="detailPrivate">Private Commission?</label>
                                </div>

                                <div class="current-status-badge">
                                    STATUS: {{ commission.status.toUpperCase() }}
                                </div>
                            </div>

                            <div v-if="isAdmin && commission.accessKey" class="access-link-section">
                                <h3 class="section-headers">Client Access</h3>
                                <div class="link-box">
                                    <input readonly :value="getClientLink(commission)"
                                        class="input-field small-input" />
                                    <button @click="copyLink(commission)" class="copy-btn">
                                        <span class="i-mdi-content-copy"></span>
                                    </button>
                                </div>
                            </div>

                            <div class="section">
                                <h3 class="section-headers">Comments</h3>
                                <div v-if="isAdmin || canComment" class="comments-list">
                                    <div v-for="(c, i) in commission.comments" :key="i" class="comment-item">
                                        <strong>{{ c.user }}:</strong> {{ c.text }}
                                        <div class="comment-time">{{ c.time }}</div>
                                    </div>
                                </div>
                                <div v-else class="private-comments">
                                    {{ commission.commentCount || 0 }} Comments (Private)
                                </div>
                                <div v-if="isAdmin || canComment" class="comment-input-box">
                                    <input v-model="newComment" placeholder="Write a comment..."
                                        class="input-field small" @keyup.enter="handleAddComment" />
                                    <button @click="handleAddComment" class="small-btn">Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.modal-card {
    background: var(--bg-card);
    border: 4px solid var(--border-color);
    box-shadow: 12px 12px 0px 0px var(--border-color);
    padding: 2rem;
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.detail-card {
    max-width: 900px;
    height: 80vh;
}

.modal-title {
    font-size: 2rem;
    font-weight: 1000;
    text-transform: uppercase;
    margin: 0;
}

.detail-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px dashed var(--border-color);
    padding-bottom: 1rem;
}

.close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    line-height: 0.5;
    color: var(--text-primary);
}

.detail-meta {
    display: flex;
    gap: 0.8rem;
    margin-top: 0.5rem;
    flex-wrap: wrap;
}

.meta-tag {
    background: var(--bg-card-alt);
    border: 2px solid var(--border-color);
    padding: 0.3rem 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.85rem;
}

.action-buttons {
    margin-left: auto;
    display: flex;
    gap: 0.5rem;
}

.delete-btn {
    background: #ef4444;
    color: white;
    border: 2px solid var(--border-color);
    padding: 0.3rem 0.6rem;
    font-weight: 900;
    text-transform: uppercase;
    font-size: 0.85rem;
    cursor: pointer;
}

.delete-btn:hover {
    background: #dc2626;
}

.archive-btn {
    background: var(--bg-card);
    color: var(--text-primary);
    border: 2px solid var(--border-color);
    padding: 0.3rem 0.6rem;
    font-weight: 900;
    text-transform: uppercase;
    font-size: 0.85rem;
    cursor: pointer;
}

.archive-btn:hover {
    background: var(--bg-card-alt);
}

.contact {
    color: var(--accent);
}

.detail-body {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    overflow-y: auto;
    padding-right: 0.5rem;
    height: 100%;
}

.section {
    margin-bottom: 2rem;
}

.section-headers {
    font-size: 1.1rem;
    font-weight: 900;
    text-transform: uppercase;
    margin-bottom: 0.8rem;
    color: var(--text-muted);
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 0.2rem;
}

.detail-desc {
    font-size: 1.1rem;
    line-height: 1.6;
    white-space: pre-wrap;
}

.log-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.log-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.log-content {
    display: flex;
    gap: 1rem;
    flex: 1;
}

.log-delete {
    background: none;
    border: none;
    color: var(--text-muted);
    font-weight: 800;
    cursor: pointer;
    font-size: 1.2rem;
    line-height: 0.5;
    padding: 0 0.2rem;
}

.log-delete:hover {
    color: #ef4444;
}

.log-time {
    color: var(--text-muted);
    font-size: 0.8rem;
    min-width: 120px;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 1rem;
}

.comment-item {
    background: var(--bg-card-alt);
    padding: 0.8rem;
    border: 1px solid var(--border-color);
    font-size: 0.95rem;
}

.comment-time {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 0.3rem;
    text-align: right;
}

.input-field {
    padding: 0.8rem;
    border: 2px solid var(--border-color);
    background: var(--bg-card-alt);
    font-family: inherit;
    font-size: 1rem;
    outline: none;
    transition: 0.2s;
    color: var(--text-primary);
}

.input-field:focus {
    border-color: var(--accent);
}

.small-select {
    width: 100%;
    margin-bottom: 1rem;
}

.current-status-badge {
    padding: 0.5rem;
    background: var(--border-color);
    color: white;
    font-weight: 900;
    text-align: center;
}

.comment-input-box {
    display: flex;
    gap: 0.5rem;
}

.small-btn {
    background: var(--text-primary);
    color: var(--bg-card);
    border: none;
    padding: 0 1rem;
    font-weight: 800;
    cursor: pointer;
    text-transform: uppercase;
}

.small {
    flex: 1;
}

@media (max-width: 900px) {
    .detail-body {
        grid-template-columns: 1fr;
    }

    .detail-card {
        height: 90vh;
    }
}

.checkbox-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-weight: 800;
    font-size: 0.9rem;
    color: var(--text-secondary);
    text-transform: uppercase;
}

.checkbox-group input {
    width: 20px;
    height: 20px;
    accent-color: var(--accent);
}

.access-link-section {
    margin-bottom: 2rem;
}

.link-box {
    display: flex;
    gap: 0.5rem;
}

.small-input {
    flex: 1;
    font-size: 0.85rem;
    padding: 0.5rem;
}

.copy-btn {
    background: var(--bg-card);
    border: 2px solid var(--border-color);
    cursor: pointer;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    color: var(--text-primary);
}

.copy-btn:hover {
    background: var(--bg-card-alt);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-fade-enter-from .modal-card,
.modal-fade-leave-to .modal-card {
    transform: scale(0.9) translateY(20px);
}

.private-comments {
    color: var(--text-muted);
    font-style: italic;
    margin-bottom: 2rem;
    font-size: 0.9rem;
}

.status-text-display {
    font-weight: 900;
    font-size: 1.2rem;
    padding: 0.5rem;
    text-align: center;
    border: 2px solid var(--border-color);
    margin-bottom: 1rem;
    background: var(--bg-card-alt);
}

.is-paid {
    background: #dcfce7;
    color: #166534;
}

.is-unpaid {
    background: #fee2e2;
    color: #991b1b;
}
</style>
