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
import rehypePartnerRel from './src/plugins/rehype-partner-rel.mjs';
import { buildLastmodMap, lastmodFor } from './src/lib/sitemap-dates.mjs';
import { contentCommitDates } from './src/lib/git-dates.mjs';

// Sitemap <lastmod>: the content file's last COMMIT date, resolved in one git
// pass at build time. Frontmatter `last_verified` / `date` are fact-checking
// dates and only stand in when there is no git history — see src/lib/sitemap-dates.mjs
// for why the two were wrong to conflate. Non-content pages (/, /checklist/,
// listings, …) have no reliable date and get no lastmod — a missing lastmod
// beats a fabricated one.
const CONTENT_SOURCES = [
  { collection: 'guides', dir: 'src/content/guides' },
  { collection: 'apps', dir: 'src/content/apps' },
  // Translations live in a subfolder of guides/ and load via the parallel
  // `guidesEs` collection (src/content.config.ts); they render at /es/guides/<slug>/.
  { collection: 'guidesEs', dir: 'src/content/guides/es' },
];

function loadContentEntries(gitDates) {
  const entries = [];
  for (const { collection, dir } of CONTENT_SOURCES) {
    const base = new URL(`./${dir}/`, import.meta.url);
    for (const file of readdirSync(base)) {
      if (!file.endsWith('.md')) continue;
      const { data } = matter(readFileSync(new URL(file, base), 'utf8'));
      entries.push({
        collection,
        slug: file.replace(/\.md$/, ''),
        data,
        gitDate: gitDates.get(`${dir}/${file}`),
      });
    }
  }
  return entries;
}

// Throws on a shallow clone rather than emitting the tip commit's date for every
// page; returns an empty map outside a repository, where the fallback applies.
const contentDates = contentCommitDates(
  CONTENT_SOURCES.map(({ dir }) => dir),
  { cwd: fileURLToPath(new URL('.', import.meta.url)) },
);

const lastmodMap = buildLastmodMap(loadContentEntries(contentDates));

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

  // English is the default locale and stays at the site root with NO /en/
  // prefix (prefixDefaultLocale: false) — existing URLs and their indexing are
  // untouched. Translated locales live under a path prefix (/es/…). See #104.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  markdown: {
    remarkPlugins: [remarkStripLeadingH1, remarkWikiLinks, remarkTrailingSlash],
    // Qualifies outbound partner/sponsored links at render time so content
    // stays plain markdown (see src/plugins/rehype-partner-rel.mjs).
    rehypePlugins: [rehypePartnerRel],
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