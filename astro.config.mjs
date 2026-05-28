// @ts-check
import { defineConfig } from 'astro/config';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// Custom integration: run Pagefind after build to generate search index
function pagefindIntegration() {
  return {
    name: 'pagefind',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const outDir = fileURLToPath(dir);
        const binPath = resolve(dirname(fileURLToPath(import.meta.url)), 'node_modules', '.bin', 'pagefind');
        execSync(`${binPath} --site "${outDir}"`, { stdio: 'inherit' });
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://chinaguide.ai',

  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },

  integrations: [sitemap(), pagefindIntegration()],

  vite: {
    plugins: [tailwindcss()],
  },
});