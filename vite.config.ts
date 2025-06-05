import { defineConfig } from "vitest/config";
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img'
import ViteYaml from '@modyfi/vite-plugin-yaml';

export default defineConfig({
    plugins: [
        enhancedImages(),
        sveltekit(),
        ViteYaml(),
    ],

    test: {
        include: ['src/**/*.{test,spec}.{js,ts}']
    }
});
