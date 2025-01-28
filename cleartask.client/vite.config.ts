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
                target: process.env.NODE_ENV === 'production'
                    ? 'http://nammaweb.live'
                    : 'http://localhost:5076',
                changeOrigin: true,
                secure: process.env.NODE_ENV === 'production'
            },
        },
    },
    preview: {
        port: 4173,
        host: true
    }
});