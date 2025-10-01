import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'


// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        createSvgIconsPlugin({
            // Pfad zu deinen SVG-Icons
            iconDirs: [path.resolve(__dirname, 'src/assets/icons')],
            symbolId: 'icon-[dir]-[name]',
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@config': path.resolve(__dirname, 'src/config.ts'),
        },
    },
})

