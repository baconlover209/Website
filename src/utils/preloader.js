// keep a global reference to prevent garbage collection of preloaded images
const imageCache = new Set();

export function preloadImages(urls) {
    return Promise.all(
        urls.map((url) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    if (img.decode) {
                        img.decode()
                            .then(() => {
                                imageCache.add(img);
                                resolve();
                            })
                            .catch(() => {
                                imageCache.add(img);
                                resolve();
                            });
                    } else {
                        imageCache.add(img);
                        resolve();
                    }
                };
                img.onerror = resolve;
                // suggest high priority to the browser
                img.fetchPriority = 'high';
                img.src = url;
            });
        })
    );
}
