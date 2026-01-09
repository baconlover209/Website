import { ref } from 'vue';
import { noise } from './noise';

const noiseFrame = ref(null);

if (typeof window !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext('2d');

    let time = Date.now() % 1000;

    function update() {
        time += 0.001;
        const scale = 0.3;
        const imageData = ctx.createImageData(10, 10);
        const data = imageData.data;

        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const val = noise(x * scale, y * scale - time * 0.7, time);
                const idx = (y * 10 + x) * 4;
                const color = val * 255 + 100;
                data[idx] = color;
                data[idx + 1] = color;
                data[idx + 2] = color;
                data[idx + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        noiseFrame.value = canvas;
        requestAnimationFrame(update);
    }

    update();
}

export { noiseFrame };
