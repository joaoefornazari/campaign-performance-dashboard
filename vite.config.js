import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'build',
        manifest: true,
        rollupOptions: {
            input: 'src/main.ts',
        },
    },
});
