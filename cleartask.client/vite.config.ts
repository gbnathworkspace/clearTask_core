import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
    plugins: [
        react(),
        createHtmlPlugin({
            template: './public/index.html',
            entry: './src/main.tsx',
        }),
    ],
    build: {
        outDir: 'dist',
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
});