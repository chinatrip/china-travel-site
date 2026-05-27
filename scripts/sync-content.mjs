#!/usr/bin/env node

/**
 * Sync content from the wiki repo to the site's content directory.
 *
 * Usage:
 *   npm run sync-content
 *
 * What it does:
 *   1. Clones/pulls the wiki repo into a temp directory
 *   2. Copies wiki/concepts/*.md → src/content/guides/
 *   3. Copies wiki/entities/*.md → src/content/apps/
 *   4. Only copies files where front matter contains status: audited
 *
 * The wiki repo is: https://github.com/chinatrip/foreigner-visiting-china-wiki
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';

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

function extractFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      fm[key.trim()] = rest.join(':').trim();
    }
  }
  return fm;
}

function syncDirectory(sourceDir, targetDir, category) {
  if (!existsSync(sourceDir)) {
    console.log(`  Source not found: ${sourceDir}, skipping.`);
    return;
  }
  mkdirSync(targetDir, { recursive: true });

  // Clean existing files in target
  for (const file of readdirSync(targetDir)) {
    if (file.endsWith('.md')) {
      rmSync(join(targetDir, file));
    }
  }

  const files = readdirSync(sourceDir).filter((f) => f.endsWith('.md'));
  let synced = 0;
  let skipped = 0;

  for (const file of files) {
    const content = readFileSync(join(sourceDir, file), 'utf-8');
    const fm = extractFrontMatter(content);

    // Only sync audited content
    if (fm.status !== 'audited') {
      skipped++;
      continue;
    }

    // Ensure category is set in front matter
    let outputContent = content;
    if (!fm.category) {
      outputContent = content.replace(/^(---\n)/, `$1category: ${category}\n`);
    }

    writeFileSync(join(targetDir, file), outputContent);
    synced++;
  }

  console.log(`  ${category}: ${synced} synced, ${skipped} skipped (draft)`);
}

// Main
console.log('=== Syncing wiki content to site ===\n');
cloneOrPull();
console.log('');

// The wiki repo has a nested structure: repo-root/foreigner-visiting-china-wiki/wiki/
const wikiRoot = existsSync(join(TEMP_DIR, 'wiki/concepts'))
  ? join(TEMP_DIR, 'wiki')
  : join(TEMP_DIR, 'foreigner-visiting-china-wiki/wiki');

syncDirectory(join(wikiRoot, 'concepts'), GUIDES_DIR, 'guide');
syncDirectory(join(wikiRoot, 'entities'), APPS_DIR, 'app');

console.log('\nDone! Run `npm run dev` to preview.');
