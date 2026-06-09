#!/usr/bin/env node

/**
 * Sync audited content from the wiki repo into the site's content directory.
 *
 * Usage:  npm run sync-content
 *
 * What it does:
 *   1. Clones/pulls the wiki repo into a temp dir (.wiki-cache).
 *   2. Collects wiki/concepts/*.md → guides, wiki/entities/*.md → apps,
 *      keeping ONLY pages whose front matter has nested `review.status: audited`.
 *   3. Only after confirming ≥1 audited page, wipes + rewrites the target dirs.
 *
 * Wiki repo: https://github.com/chinatrip/foreigner-visiting-china-wiki
 *
 * Safety:
 *   - Audited gate reads the REAL nested `review.status` via a YAML parser
 *     (gray-matter), not a flattened best-effort parse. See issue #3.
 *   - Never publishes an empty site: if 0 audited pages are found (wiki
 *     unreachable, all draft, or schema drift), it aborts with a non-zero exit
 *     BEFORE touching src/content/, so CI fails and no PR/deploy happens. See #4.
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

// Use HTTPS with token in CI, SSH locally
const WIKI_REPO = process.env.GITHUB_TOKEN
  ? `https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/chinatrip/foreigner-visiting-china-wiki.git`
  : 'git@github.com:chinatrip/foreigner-visiting-china-wiki.git';
const TEMP_DIR = join(import.meta.dirname, '../.wiki-cache');
const GUIDES_DIR = join(import.meta.dirname, '../src/content/guides');
const APPS_DIR = join(import.meta.dirname, '../src/content/apps');

function cloneOrPull() {
  if (existsSync(join(TEMP_DIR, '.git'))) {
    console.log('Pulling latest wiki content...');
    execSync('git pull --ff-only', { cwd: TEMP_DIR, stdio: 'inherit' });
  } else {
    console.log('Cloning wiki repo...');
    if (existsSync(TEMP_DIR)) rmSync(TEMP_DIR, { recursive: true });
    execSync(`git clone --depth 1 ${WIKI_REPO} ${TEMP_DIR}`, { stdio: 'inherit' });
  }
}

/**
 * Collect audited pages from a source dir. Parses front matter properly and
 * keeps only `review.status === 'audited'`. Does NOT modify the target dir
 * (so the empty-site guard can run before any destructive wipe).
 * @returns {{name: string, outputContent: string}[]}
 */
function collectAudited(sourceDir, category) {
  if (!existsSync(sourceDir)) {
    console.log(`  Source not found: ${sourceDir}, skipping.`);
    return [];
  }
  const files = readdirSync(sourceDir).filter((f) => f.endsWith('.md'));
  const items = [];
  let skipped = 0;

  for (const file of files) {
    const content = readFileSync(join(sourceDir, file), 'utf-8');
    let fm;
    try {
      fm = matter(content).data;
    } catch (err) {
      console.warn(`  ⚠ ${file}: front matter parse failed (${err.message}), skipping.`);
      skipped++;
      continue;
    }

    // Audited gate — the wiki schema nests status under `review:`.
    if (fm.review?.status !== 'audited') {
      skipped++;
      continue;
    }

    // Inject category at the top level if missing (string-level, to preserve
    // the original content/formatting verbatim).
    const outputContent = fm.category
      ? content
      : content.replace(/^(---\r?\n)/, `$1category: ${category}\n`);

    items.push({ name: file, outputContent });
  }

  console.log(`  ${category}: ${items.length} audited, ${skipped} skipped`);
  return items;
}

/** Wipe existing .md in target, then write the collected items. */
function writeDir(targetDir, items) {
  mkdirSync(targetDir, { recursive: true });
  for (const file of readdirSync(targetDir)) {
    if (file.endsWith('.md')) rmSync(join(targetDir, file));
  }
  for (const { name, outputContent } of items) {
    writeFileSync(join(targetDir, name), outputContent);
  }
}

// ---- Main ----
console.log('=== Syncing wiki content to site ===\n');

try {
  cloneOrPull();
} catch (err) {
  console.error(`\n❌ Failed to fetch wiki content: ${err.message}`);
  process.exit(1);
}
console.log('');

// The wiki repo nests content under repo-root/foreigner-visiting-china-wiki/wiki/
const wikiRoot = existsSync(join(TEMP_DIR, 'wiki/concepts'))
  ? join(TEMP_DIR, 'wiki')
  : join(TEMP_DIR, 'foreigner-visiting-china-wiki/wiki');

const guides = collectAudited(join(wikiRoot, 'concepts'), 'guide');
const apps = collectAudited(join(wikiRoot, 'entities'), 'app');
const total = guides.length + apps.length;

// #4 — never publish an empty site. Abort before any destructive write.
if (total === 0) {
  console.error('\n❌ 0 audited pages found — aborting WITHOUT modifying src/content/.');
  console.error('   Likely: wiki unreachable, all pages draft, or front-matter schema drift.');
  console.error('   Investigate before publishing (CI fails here; no PR / no deploy).');
  process.exit(1);
}

writeDir(GUIDES_DIR, guides);
writeDir(APPS_DIR, apps);

console.log(`\nDone! ${total} pages synced (${guides.length} guides, ${apps.length} apps).`);
