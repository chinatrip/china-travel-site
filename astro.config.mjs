// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import { readFileSync, readdirSync } from 'node:fs';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';
import matter from 'gray-matter';

import remarkWikiLinks from './src/plugins/remark-wikilinks.mjs';
import remarkTrailingSlash from './src/plugins/remark-trailing-slash.mjs';
import remarkStripLeadingH1 from './src/plugins/remark-strip-leading-h1.mjs';
import { buildLastmodMap, lastmodFor } from './src/lib/sitemap-dates.mjs';

// Sitemap <lastmod>: read content frontmatter (last_verified || date) at build
// time. Non-content pages (/, /checklist/, listings, …) have no reliable date
// and get no lastmod — a missing lastmod beats a fabricated one.
function loadContentEntries() {
  const entries = [];
  for (const collection of ['guides', 'apps']) {
    const dir = new URL(`./src/content/${collection}/`, import.meta.url);
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      const { data } = matter(readFileSync(new URL(file, dir), 'utf8'));
      entries.push({ collection, slug: file.replace(/\.md$/, ''), data });
    }
  }
  return entries;
}

const lastmodMap = buildLastmodMap(loadContentEntries());

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

  integrations: [
    sitemap({
      // /search/ is a functional shell page (noindex) — keep it out of the sitemap.
      filter: (page) => new URL(page).pathname !== '/search/',
      serialize(item) {
        const lastmod = lastmodFor(item.url, lastmodMap);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
    pagefindIntegration(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});