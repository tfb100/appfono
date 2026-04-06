import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/comunicamais/',
    worker: {
        format: 'es',
        plugins: () => [react()],
    },
    // Otimização de carga para evitar latência no WebView do Android
    build: {
        target: 'esnext',
        minify: 'terser',
        cssMinify: true
    }
})
