import { defineConfig, presetUno, presetWebFonts, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
    shortcuts: [
        ['neo-btn', 'flex-1 rounded-lg border-2 border-[var(--text-dim)] bg-[var(--bg-card)] p-4 font-bold font-display cursor-pointer flex items-center justify-center gap-2 transition hover:bg-[var(--bg-card-alt)] text-[var(--text-muted)]'],
        ['neo-btn-primary', 'flex-1 rounded-lg border-2 border-[var(--accent)] bg-[var(--accent)] p-4 font-bold font-display cursor-pointer flex items-center justify-center gap-2 transition hover:opacity-90 text-white'],
        ['neo-card', 'border-[var(--border-color)] shadow-[12px_12px_0px_0px_var(--border-color)] rounded-2xl overflow-hidden'],
        ['neo-close-btn', 'bg-[var(--text-primary)] border-none text-[var(--bg-sidebar)] w-9 h-9 rounded-lg hover:bg-[var(--bg-sidebar)] hover:text-[var(--text-primary)] hover:scale-110 transition-transform duration-100 flex items-center justify-center cursor-pointer'],
    ],
    presets: [
        presetUno(),
        presetIcons({
            scale: 1.2,
            warn: true,
        }),
        presetWebFonts({
            provider: 'google',
            fonts: {
                sans: 'Inter:400,600,800',
                display: 'Outfit:400,700,900',
                handwriting: 'Caveat',
            },
        }),
    ],
    transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
    ],
})
