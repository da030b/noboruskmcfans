// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel({
    output: 'hybrid' // または 'server'
  }),
  integrations: [
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
