import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/index.tsx'],
            refresh: true,
        }),
        react()
    ],
    server: {
        host: '0.0.0.0',
        hmr: {
          host: 'localhost'
        },
        allowedHosts: true,
        cors: true,
     },
     build: {
        sourcemap: true,
        manifest: true,
        outDir: './public/build',
        emptyOutDir: false
     },
     esbuild: {
        include: /\.(tsx?|jsx?)$/,
        exclude: [],
        loader: 'tsx'
      },
});
