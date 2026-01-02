import { defineConfig, presetUno, presetWebFonts, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
    shortcuts: [
        ['neo-btn', 'flex-1 rounded-lg border-2 border-slate-200 bg-white p-4 font-bold font-display cursor-pointer flex items-center justify-center gap-2 transition hover:bg-slate-100 text-slate-600'],
        ['neo-btn-primary', 'flex-1 rounded-lg border-2 border-cyan-500 bg-cyan-500 p-4 font-bold font-display cursor-pointer flex items-center justify-center gap-2 transition hover:bg-cyan-600 hover:border-cyan-600 text-white'],
        ['neo-card', 'border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl overflow-hidden'],
        ['neo-close-btn', 'bg-black border-none text-white w-9 h-9 rounded-lg hover:bg-white hover:text-black hover:scale-110 transition-transform duration-100 flex items-center justify-center cursor-pointer'],
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
