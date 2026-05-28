// @ts-check
import { defineConfig } from 'astro/config';
import { execSync } from 'child_process';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// Custom integration: run Pagefind after build to generate search index
function pagefindIntegration() {
  return {
    name: 'pagefind',
    hooks: {
      'astro:build:done': ({ dir }) => {
        execSync(`pagefind --site "${dir.pathname}"`, { stdio: 'inherit' });
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