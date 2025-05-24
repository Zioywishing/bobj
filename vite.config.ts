import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        dts()
    ],
    build: {
        lib: {
            entry: resolve(__dirname, './lib/bobj/index.ts'),
            name: 'bobj',
            fileName: 'bobj',
        },
        rollupOptions: {
            output: {
                globals: {
                    bobj: 'bobj',
                },
            },
        },
    },
})