import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:5076',
                changeOrigin: true,
                secure: false
            },
        },
    },
    preview: {
        port: 4173,
        host: true
    }
});