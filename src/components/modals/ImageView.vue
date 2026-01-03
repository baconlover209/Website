<script setup>
defineProps({
    image: {
        type: Object,
        default: null,
    },
})

defineEmits(["close"]);
</script>

<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="image"
                class="fixed inset-0 blur-background backdrop-blur-sm flex items-center justify-center z-10000 p-8"
                @click.self="$emit('close')">
                <img :src="image.img" class="max-h-80vh max-w-80vw drop-shadow-2xl drop-shadow-color-black"/>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.blur-background {
    background: radial-gradient(circle at 50vw 0, rgba(235, 217, 170, 0.2) 0%, rgba(0, 0, 0, .1)30%, rgba(0, 0, 0, .1) 100%), #000000AA;
    /*rgba(255, 245, 217, .2)*/
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.image-fade-enter-active,
.image-fade-leave-active {
    transition: opacity 0.2s ease;
    animation: model-enter 0.5s normal ;
}


@keyframes model-enter {
    0% {max-width: 0; max-height: 0;}
    50% {width: 80vw; height: 0;}
    100% {width: 80vw; height: 80vh;}
    
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>