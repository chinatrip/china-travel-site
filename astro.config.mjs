// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// Custom integration: run Pagefind after build using its Node API
function pagefindIntegration() {
  return {
    name: 'pagefind',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const targetDir = fileURLToPath(dir);
        const pagefind = await import('pagefind');
        const { index } = await pagefind.createIndex();
        await index.addDirectory({ path: targetDir });
        await index.writeFiles({ outputPath: `${targetDir}/pagefind` });
        console.log(`[pagefind] Search index written to ${targetDir}/pagefind`);
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

  adapter: cloudflare()
});