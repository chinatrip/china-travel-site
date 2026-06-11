// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

import remarkWikiLinks from './src/plugins/remark-wikilinks.mjs';
import remarkTrailingSlash from './src/plugins/remark-trailing-slash.mjs';
import remarkStripLeadingH1 from './src/plugins/remark-strip-leading-h1.mjs';

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

  trailingSlash: 'always',

  markdown: {
    remarkPlugins: [remarkStripLeadingH1, remarkWikiLinks, remarkTrailingSlash],
    shikiConfig: {
      theme: 'github-light',
    },
  },

  integrations: [sitemap(), pagefindIntegration()],

  vite: {
    plugins: [tailwindcss()],
  },
});