<script setup>
import { ref } from "vue";

const props = defineProps({
    show: Boolean,
});

const emit = defineEmits(["close", "create"]);

const form = ref({
    client: "",
    type: "Sketch",
    desc: "",
    price: 0,
    contact: "",
    status: "todo",
    paid: false,
    isPrivate: false,
});

function resetForm() {
    form.value = {
        client: "",
        type: "Sketch",
        desc: "",
        price: 0,
        contact: "",
        status: "todo",
        paid: false,
        isPrivate: false,
    };
}

function handleCreate() {
    if (!form.value.client) return;
    emit("create", { ...form.value });
    resetForm();
}

function handleCancel() {
    resetForm();
    emit("close");
}
</script>

<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="show" class="modal-overlay" @click.self="emit('close')">
                <div class="modal-card">
                    <div class="modal-header">
                        <h2 class="modal-title">New Request</h2>
                    </div>

                    <div class="modal-body">
                        <div class="form-section">
                            <div class="input-group full">
                                <label>Client Name</label>
                                <input v-model="form.client" type="text" class="input-field"
                                    placeholder="Enter name..." />
                            </div>

                            <div class="form-row">
                                <div class="input-group">
                                    <label>Type</label>
                                    <div class="select-wrapper">
                                        <select v-model="form.type" class="input-field">
                                            <option>Sketch</option>
                                            <option>Flat</option>
                                            <option>Cell</option>
                                            <option>Full</option>
                                            <option>Other</option>
                                        </select>
                                        <span class="select-arrow">▼</span>
                                    </div>
                                </div>
                                <div class="input-group">
                                    <label>Price ($)</label>
                                    <input v-model.number="form.price" type="number" class="input-field" />
                                </div>
                            </div>

                            <div class="input-group full">
                                <label>Contact Info</label>
                                <input v-model="form.contact" type="text" class="input-field"
                                    placeholder="Discord ID or Email" />
                            </div>

                            <div class="input-group full">
                                <label>Description</label>
                                <textarea v-model="form.desc" class="input-field area" rows="4"
                                    placeholder="Details about the commission..."></textarea>
                            </div>

                            <div class="checkbox-wrapper">
                                <label class="checkbox-label">
                                    <input v-model="form.isPrivate" type="checkbox" />
                                    <span class="custom-checkbox"></span>
                                    <span class="checkbox-text">Private Commission</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button class="action-btn cancel" @click="handleCancel">
                            <span>Cancel</span>
                        </button>
                        <button class="action-btn confirm" @click="handleCreate">
                            <span>Create Item</span>
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

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(2px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.modal-card {
    background: var(--bg-card);
    border: 2px solid var(--border-color);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 450px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-header {
    background: var(--bg-card-alt);
    padding: 1.2rem;
    border-bottom: 2px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title {
    font-size: 1.4rem;
    font-weight: 900;
    text-transform: uppercase;
    margin: 0;
}

.modal-body {
    padding: 1.5rem;
}

.form-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-row {
    display: flex;
    gap: 1rem;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    flex: 1;
}

.input-group.full {
    width: 100%;
}

label {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: var(--text-muted);
}

.input-field {
    padding: 0.6rem 0.8rem;
    border: 2px solid var(--border-color);
    background: var(--bg-primary);
    font-family: inherit;
    font-size: 0.9rem;
    color: var(--text-primary);
    outline: none;
    transition: border-color 0.2s;
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
}

.input-field:focus {
    border-color: var(--accent);
}

.area {
    resize: vertical;
    min-height: 80px;
}

.select-wrapper {
    position: relative;
    width: 100%;
}

.select-arrow {
    position: absolute;
    right: 0.8rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 0.7rem;
    opacity: 0.6;
}

.checkbox-wrapper {
    margin-top: 0.2rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    cursor: pointer;
    user-select: none;
}

.checkbox-label input {
    display: none;
}

.custom-checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-color);
    background: var(--bg-primary);
    position: relative;
}

.checkbox-label input:checked+.custom-checkbox {
    background: var(--accent);
    border-color: var(--accent);
}

.checkbox-label input:checked+.custom-checkbox::after {
    content: "✓";
    position: absolute;
    inset: 0;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 1rem;
}

.checkbox-text {
    font-weight: 700;
    font-size: 0.85rem;
}

.modal-actions {
    padding: 1.2rem 1.5rem;
    background: var(--bg-card-alt);
    border-top: 2px solid var(--border-color);
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
}

.action-btn {
    padding: 0.6rem 1.4rem;
    font-weight: 800;
    text-transform: uppercase;
    border: 2px solid var(--border-color);
    background: transparent;
    color: var(--text-primary);
    cursor: pointer;
    font-size: 0.85rem;
    transition: background 0.2s;
}

.action-btn:hover {
    background: var(--bg-primary);
}

.confirm {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
}

.confirm:hover {
    background: var(--accent-hover);
    filter: brightness(1.1);
}
</style>
