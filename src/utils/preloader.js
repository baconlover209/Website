// keep a global reference to prevent garbage collection of preloaded images
const imageCache = new Set();

export function preloadImages(urls) {
    return Promise.all(
        urls.map((url) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    imageCache.add(img);
                    resolve();
                };
                img.onerror = resolve;
                img.src = url;
            });
        })
    );
}
