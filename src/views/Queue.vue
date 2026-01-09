<script setup>
import { ref, onMounted } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import NewCommissionModal from "@/components/modals/NewCommissionModal.vue";
import CommissionDetailModal from "@/components/modals/CommissionDetailModal.vue";
import {
    fetchCommissions, createCommission, updateCommission,
    deleteCommission, deleteCommissionLog,
    addCommissionComment, isUserAdmin
} from "@/utils/api";

const showAddModal = ref(false);
const showDetailModal = ref(false);
const selectedCommission = ref(null);

const columns = ref([
    { id: "todo", title: "To Do", tasks: [] },
    { id: "wip", title: "In Progress", tasks: [] },
    { id: "review", title: "Review", tasks: [] },
    { id: "done", title: "Done", tasks: [] }
]);

const archivedTasks = ref([]);
const isArchiveOpen = ref(false);

async function loadData() {
    try {
        const data = await fetchCommissions();

        columns.value.forEach(Col => Col.tasks = []);
        archivedTasks.value = [];

        data.forEach(task => {
            if (task.status === 'archive') {
                archivedTasks.value.push(task);
            } else {
                const col = columns.value.find(c => c.id === task.status);
                if (col) {
                    col.tasks.push(task);
                } else {
                    columns.value[0].tasks.push(task);
                }
            }
        });
    } catch (e) {
        console.error("Failed to load commissions:", e);
    }
}

onMounted(async () => {
    const query = new URLSearchParams(window.location.search);
    const openId = query.get('id');
    const openKey = query.get('key');

    if (openId && openKey) {
        const map = JSON.parse(localStorage.getItem('commission_key_map') || '{}');
        map[openId] = openKey;
        localStorage.setItem('commission_key_map', JSON.stringify(map));
    }

    await loadData();

    if (openId) {
        let found = null;
        for (const col of columns.value) {
            found = col.tasks.find(t => t.id == openId);
            if (found) break;
        }
        if (!found) {
            found = archivedTasks.value.find(t => t.id == openId);
        }

        if (found) {
            openDetail(found);
        }
    }
});

async function handleCreateCommission(commData) {
    try {
        await createCommission(commData);
        showAddModal.value = false;
        await loadData();
    } catch (e) {
        alert("Failed to create commission");
        console.error(e);
    }
}

function openDetail(task) {
    selectedCommission.value = task;
    showDetailModal.value = true;
}

async function handleAddComment(text) {
    if (!selectedCommission.value) return;
    try {
        let username = 'Anonymous';
        if (isUserAdmin.value) {
            username = 'Dart';
        } else if (hasKeyForCommission(selectedCommission.value.id)) {
            username = selectedCommission.value.client;
        }

        const newComment = await addCommissionComment(selectedCommission.value.id, text, username);
        selectedCommission.value.comments.push(newComment);
    } catch (e) {
        alert("Failed to add comment");
    }
}

async function handleUpdateStatus(payload) {
    if (!selectedCommission.value) return;
    try {
        const updateData = {};
        if (typeof payload.paid !== 'undefined') {
            updateData.paid = payload.paid;
        }
        if (typeof payload.isPrivate !== 'undefined') {
            updateData.isPrivate = payload.isPrivate;
        }

        const updated = await updateCommission(selectedCommission.value.id, updateData);
        Object.assign(selectedCommission.value, updated);
    } catch (e) {
        alert("Failed to update status");
    }
}

async function handleArchiveCommission(id) {
    try {
        await updateCommission(id, { status: 'archive' });

        await loadData();

        showDetailModal.value = false;
        selectedCommission.value = null;
        isArchiveOpen.value = true;
    } catch (e) {
        alert("Failed to archive");
        await loadData();
    }
}

async function archiveAllDone() {
    const doneCol = columns.value.find(c => c.id === 'done');
    if (!doneCol || doneCol.tasks.length === 0) return;

    if (confirm(`Archive all ${doneCol.tasks.length} items from Done?`)) {
        try {
            const promises = doneCol.tasks.map(task =>
                updateCommission(task.id, { status: 'archive' })
            );
            await Promise.all(promises);
            isArchiveOpen.value = true;
            await loadData();
        } catch (e) {
            alert("Failed to batch archive");
        }
    }
}

async function handleDeleteCommission(id) {
    try {
        await deleteCommission(id);
        showDetailModal.value = false;
        selectedCommission.value = null;
        await loadData();
    } catch (e) {
        alert("Failed to delete");
    }
}

function quickDelete(e, id) {
    e.stopPropagation();
    if (confirm("Delete this commission?")) {
        handleDeleteCommission(id);
    }
}

async function handleDeleteLog(index) {
    if (!selectedCommission.value) return;
    const log = selectedCommission.value.logs[index];
    if (!log) return;

    try {
        await deleteCommissionLog(log.id);
        selectedCommission.value.logs.splice(index, 1);
    } catch (e) {
        alert("Failed to delete log");
    }
}

async function onAdd(evt, col) {
    if (typeof evt.newIndex === 'number' && col.tasks[evt.newIndex]) {
        const task = col.tasks[evt.newIndex];
        if (task.status !== col.id) {
            const oldStatus = task.status;
            task.status = col.id;
            try {
                const updated = await updateCommission(task.id, { status: col.id });
                Object.assign(task, updated);
            } catch (e) {
                console.error("Failed to move task", e);
                task.status = oldStatus;
                await loadData();
            }
        }
    }
}

async function onArchiveAdd(evt) {
    if (typeof evt.newIndex === 'number' && archivedTasks.value[evt.newIndex]) {
        const task = archivedTasks.value[evt.newIndex];
        if (task.status !== 'archive') {
            const oldStatus = task.status;
            task.status = 'archive';
            try {
                const updated = await updateCommission(task.id, { status: 'archive' });
                Object.assign(task, updated);
            } catch (e) {
                console.error("Failed to archive task", e);
                task.status = oldStatus;
                await loadData();
            }
        }
    }
}

function hasKeyForCommission(id) {
    if (!id) return false;
    const map = JSON.parse(localStorage.getItem('commission_key_map') || '{}');
    return !!map[id];
}

function formatPrice(p) {
    return "$" + p;
}
</script>

<template>
    <div class="queue-view">
        <div class="header-section">
            <div class="header-left">
                <h1 class="page-title">Queue</h1>
                <div class="header-line"></div>
            </div>
            <div class="header-actions">
                <button v-if="isUserAdmin" class="archive-toggle" @click="isArchiveOpen = !isArchiveOpen"
                    :class="{ active: isArchiveOpen }">
                    <span class="i-mdi-archive"></span> ARCHIVE
                </button>
                <button v-if="isUserAdmin" class="add-btn" @click="showAddModal = true">
                    + NEW
                    <div class="btn-shadow"></div>
                </button>
            </div>
        </div>

        <div class="board-container">
            <div class="kanban-board">
                <div v-for="col in columns" :key="col.id" class="kanban-column">
                    <div class="column-header">
                        <div class="header-title-group">
                            <span class="col-title">{{ col.title }}</span>
                            <span class="col-count">{{ col.tasks.length }}</span>
                        </div>
                        <button v-if="col.id === 'done' && col.tasks.length > 0 && isUserAdmin" class="archive-all-btn"
                            @click="archiveAllDone" title="Archive All">
                            ARCHIVE ALL
                        </button>
                    </div>

                    <VueDraggable v-model="col.tasks" group="tasks" :animation="150" ghost-class="ghost-card"
                        drag-class="drag-card" class="drag-area" @add="(e) => onAdd(e, col)" :disabled="!isUserAdmin">
                        <div v-for="element in col.tasks" :key="element.id" class="task-card"
                            @click="openDetail(element)">
                            <div class="card-header-dense">
                                <div class="header-left-group">
                                    <h3 class="client-name">{{ element.client }}</h3>
                                    <div class="mini-badges">
                                        <span class="mini-badge">{{ element.type }}</span>
                                        <span class="mini-badge price" :class="{ 'unpaid': !element.paid }">{{
                                            formatPrice(element.price) }}</span>
                                    </div>
                                </div>
                                <div class="header-right-group">
                                    <span class="date">{{ element.date }}</span>
                                    <button v-if="isUserAdmin" class="quick-delete-btn"
                                        @click="(e) => quickDelete(e, element.id)" title="Delete">×</button>
                                </div>
                            </div>
                            <p class="short-desc">{{ element.desc }}</p>
                        </div>
                    </VueDraggable>
                </div>
            </div>

            <div v-if="isUserAdmin" class="archive-sidebar" :class="{ 'open': isArchiveOpen }">
                <div class="archive-header">
                    <span>ARCHIVE ({{ archivedTasks.length }})</span>
                    <button class="close-archive" @click="isArchiveOpen = false">×</button>
                </div>

                <div class="archive-content-wrapper">
                    <div v-if="archivedTasks.length === 0" class="empty-archive">
                        Drag items here needed
                    </div>
                    <VueDraggable v-model="archivedTasks" group="tasks" :animation="150" ghost-class="ghost-card"
                        class="archive-list" @add="onArchiveAdd" draggable=".task-card">
                        <div v-for="element in archivedTasks" :key="element.id" class="task-card archive-card"
                            @click="openDetail(element)">
                            <div class="card-header-dense">
                                <div class="header-left-group">
                                    <h3 class="client-name">{{ element.client }}</h3>
                                    <div class="mini-badges">
                                        <span class="mini-badge">{{ element.type }}</span>
                                    </div>
                                </div>
                                <div class="header-right-group">
                                    <span class="date">{{ element.date }}</span>
                                    <button class="quick-delete-btn"
                                        @click="(e) => quickDelete(e, element.id)">×</button>
                                </div>
                            </div>
                        </div>
                    </VueDraggable>
                </div>
            </div>
        </div>


        <NewCommissionModal :show="showAddModal" @close="showAddModal = false" @create="handleCreateCommission" />

        <CommissionDetailModal :show="showDetailModal" :commission="selectedCommission" :is-admin="isUserAdmin"
            :can-comment="isUserAdmin || hasKeyForCommission(selectedCommission?.id)" @close="showDetailModal = false"
            @add-comment="handleAddComment" @update-status="handleUpdateStatus"
            @delete-commission="handleDeleteCommission" @delete-log="handleDeleteLog"
            @archive-commission="handleArchiveCommission" />

    </div>
</template>

<style scoped>
.queue-view {
    padding: 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
}

.header-left {
    flex: 1;
}

.page-title {
    font-size: 3.5rem;
    font-weight: 1000;
    text-transform: uppercase;
    line-height: 1;
    margin-bottom: 0.5rem;
}

.header-line {
    height: 5px;
    background: var(--text-primary);
    width: 200px;
}

.add-btn {
    position: relative;
    padding: 0.8rem 1.5rem;
    font-weight: 1000;
    text-transform: uppercase;
    border: 3px solid var(--border-color);
    background: var(--accent);
    color: white;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.add-btn:hover {
    transform: translate(-3px, -3px);
}

.add-btn:hover .btn-shadow {
    opacity: 1;
    transform: translate(3px, 3px);
}

.btn-shadow {
    position: absolute;
    inset: -3px;
    background: var(--border-color);
    z-index: -1;
    opacity: 0;
    transition: 0.2s;
}

.board-container {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: relative;
}

.kanban-board {
    display: flex;
    gap: 1.5rem;
    flex: 1;
    overflow-x: auto;
    padding-bottom: 1rem;
    transition: all 0.3s ease;
}

.kanban-column {
    flex: 0 0 260px;
    background: var(--bg-card-alt);
    border: 3px solid var(--border-color);
    display: flex;
    flex-direction: column;
    max-height: 100%;
}

.column-header {
    padding: 1rem;
    background: var(--bg-card);
    border-bottom: 3px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 900;
    text-transform: uppercase;
    font-size: 1.1rem;
}

.header-title-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.archive-all-btn {
    background: none;
    border: 2px solid var(--border-color);
    cursor: pointer;
    font-size: 0.7rem;
    font-weight: 800;
    color: var(--text-muted);
    transition: all 0.2s;
    padding: 0.2rem 0.4rem;
    margin-left: 0.5rem;
    white-space: nowrap;
}

.archive-all-btn:hover {
    color: var(--accent);
    border-color: var(--accent);
    background: var(--bg-card-alt);
}

.col-count {
    background: var(--border-color);
    color: white;
    padding: 0.1rem 0.5rem;
    border-radius: 4px;
    font-size: 0.85rem;
}

.drag-area {
    flex: 1;
    padding: 0.75rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-height: 100px;
}

.task-card {
    background: var(--bg-card);
    border: 2px solid var(--border-color);
    padding: 0.6rem;
    cursor: grab;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 4px 4px 0px 0px var(--border-color);
    margin-bottom: 0.5rem;
}

.task-card:hover {
    transform: translateY(-2px);
    box-shadow: 6px 6px 0px 0px var(--border-color);
}

.task-card:active {
    cursor: grabbing;
}

.card-header-dense {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.3rem;
}

.header-left-group {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    flex: 1;
}

.client-name {
    font-weight: 900;
    font-size: 0.95rem;
    line-height: 1.1;
    margin: 0;
}

.mini-badges {
    display: flex;
    gap: 0.3rem;
    flex-wrap: wrap;
}

.mini-badge {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: 0 0.2rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    line-height: 1.2;
}

.mini-badge.price {
    background: #dcfce7;
    color: #166534;
}

.mini-badge.price.unpaid {
    background: #fee2e2;
    color: #991b1b;
}

.short-desc {
    font-size: 0.8rem;
    color: var(--text-secondary);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.3;
    margin: 0;
}

.header-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.archive-toggle {
    background: transparent;
    border: 2px solid var(--border-color);
    padding: 0.6rem 1rem;
    font-weight: 800;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
    color: var(--text-primary);
}

.archive-toggle:hover {
    background: var(--bg-card-alt);
}

.archive-toggle.active {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
}

.archive-sidebar {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 320px;
    background: var(--bg-card);
    border-left: 4px solid var(--border-color);
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 100;
    display: flex;
    flex-direction: column;
    box-shadow: -10px 0 20px rgba(0, 0, 0, 0.1);
}

.archive-sidebar.open {
    transform: translateX(0);
}

.archive-header {
    padding: 1rem;
    background: var(--bg-card-alt);
    border-bottom: 3px solid var(--border-color);
    font-weight: 900;
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-archive {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 0.5;
    padding: 0.2rem;
}

.archive-list {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.archive-card {
    opacity: 0.7;
    border-style: dashed;
}

.archive-card:hover {
    opacity: 1;
}

.archive-content-wrapper {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.empty-archive {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 3px dashed var(--border-color);
    color: var(--text-muted);
    font-weight: 800;
    opacity: 0.5;
    pointer-events: none;
    z-index: 10;
}

.header-right-group {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.2rem;
}

.quick-delete-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    font-weight: 900;
    font-size: 1.2rem;
    line-height: 0.5;
    cursor: pointer;
    padding: 0;
    opacity: 0;
    transition: opacity 0.2s;
}

.quick-delete-btn:hover {
    color: #ef4444;
}

.task-card:hover .quick-delete-btn {
    opacity: 1;
}

.ghost-card {
    background: var(--bg-card-alt);
    border: 2px dashed var(--border-color);
    opacity: 0.5;
}

.drag-card {
    transform: rotate(3deg);
    cursor: grabbing;
    opacity: 0.9;
    box-shadow: 15px 15px 0px 0px rgba(0, 0, 0, 0.2);
}
</style>