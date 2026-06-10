#!/usr/bin/env node

/**
 * NON-DESTRUCTIVE sync of audited wiki content into the site's content directory.
 *
 * The wiki owns the knowledge layer; the site owns an SEO/GEO layer on top of it
 * (frontmatter `description`/`faqs`/`category`, question-form headings, site-native
 * GEO pages). A sync must merge wiki updates IN without wiping the site layer OUT.
 *
 * Per page:
 *   - frontmatter: wiki fields taken verbatim from the new wiki version; SITE_OWNED_FIELDS
 *     are re-injected from the current site file (field-level ownership, deterministic).
 *   - body: git merge-file 3-way merge — base is the wiki version last merged into this
 *     file (recorded per page in src/content/wiki-sync-state.json), ours is the current
 *     site body, theirs is the new wiki body. Overlapping edits leave conflict markers
 *     in the file: the sync PR shows them, scripts/check-conflict-markers.mjs turns CI
 *     red, and a human resolves them in the PR. Conflicts are EXPOSED, never silently
 *     resolved.
 *   - pages with no wiki counterpart and no state entry are site-native (e.g. the GEO
 *     landing pages) and are never touched or deleted.
 *   - pages whose wiki source disappeared or lost `review.status: audited` are NOT
 *     deleted — they are listed in the sync report for human confirmation.
 *
 * The run writes sync-report.md (gitignored) which becomes the PR body.
 *
 * Usage:  npm run sync-content
 *
 * Safety (kept from the previous destructive version):
 *   - Audited gate reads the REAL nested `review.status` via a YAML parser. See issue #3.
 *   - Never publishes an empty site: 0 audited pages → abort non-zero BEFORE any write. See #4.
 */

import { execSync, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import matter from 'gray-matter';

// Use HTTPS with token in CI, SSH locally
const WIKI_REPO = process.env.GITHUB_TOKEN
  ? `https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/chinatrip/foreigner-visiting-china-wiki.git`
  : 'git@github.com:chinatrip/foreigner-visiting-china-wiki.git';
const TEMP_DIR = join(import.meta.dirname, '../.wiki-cache');
const CONTENT_DIR = join(import.meta.dirname, '../src/content');
const STATE_PATH = join(CONTENT_DIR, 'wiki-sync-state.json');
const REPORT_PATH = join(import.meta.dirname, '../sync-report.md');

/**
 * SEO frontmatter fields a sync must never STRIP from a page.
 * - wiki lacks the field, site has it → site value re-injected (gap-fill; e.g. `category`,
 *   or a site-side description the wiki hasn't adopted yet).
 * - both have it → the wiki (canonical since the 2026-06 faqs/description migration) wins;
 *   if the values differ, the overridden site value is REPORTED so a site-side edit is
 *   never silently lost — port it to the wiki or restore it in the sync PR.
 */
export const SITE_OWNED_FIELDS = ['description', 'faqs', 'category'];

// Collection ↔ wiki directory mapping
const COLLECTIONS = [
  { collection: 'guides', wikiDir: 'concepts', category: 'guide' },
  { collection: 'apps', wikiDir: 'entities', category: 'app' },
];

// ---------------------------------------------------------------------------
// Pure helpers (exported, unit-tested)
// ---------------------------------------------------------------------------

const FM_BLOCK_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** Split a raw markdown file into its verbatim frontmatter block and the body. */
export function splitFrontmatter(raw) {
  const m = raw.match(FM_BLOCK_RE);
  if (!m) return { fmBlock: '', body: raw };
  return { fmBlock: m[0], body: raw.slice(m[0].length) };
}

/**
 * Field-level frontmatter merge.
 * Takes the WIKI frontmatter block verbatim (low diff noise, exactly like the old
 * category injection) and injects SITE_OWNED_FIELDS the wiki lacks from the current
 * site file. When the wiki carries the field too, its verbatim value is kept
 * (injecting would create a duplicate YAML key) and a genuine value divergence is
 * reported so site-side edits are never silently lost.
 *
 * @returns {{ fmBlock: string, fieldConflicts: {field, siteValue}[] }}
 */
export function mergeFrontmatter(oursRaw, theirsRaw, { defaultCategory } = {}) {
  const ours = matter(oursRaw);
  const theirs = matter(theirsRaw);
  const { fmBlock: theirsBlock } = splitFrontmatter(theirsRaw);

  const inject = {};
  const fieldConflicts = [];
  for (const field of SITE_OWNED_FIELDS) {
    const siteValue = ours.data?.[field];
    if (siteValue === undefined) continue;
    const wikiValue = theirs.data?.[field];
    if (wikiValue !== undefined) {
      // Wiki carries the field → wiki wins; surface only a REAL divergence.
      if (JSON.stringify(wikiValue) !== JSON.stringify(siteValue)) fieldConflicts.push({ field, siteValue });
      continue;
    }
    inject[field] = siteValue;
  }
  if (inject.category === undefined && theirs.data?.category === undefined && defaultCategory) {
    inject.category = defaultCategory;
  }

  if (Object.keys(inject).length === 0) return { fmBlock: theirsBlock, fieldConflicts };

  // Serialize just the injected fields via gray-matter's YAML engine.
  const yaml = matter.stringify('', inject).replace(/^---\r?\n/, '').replace(/---\r?\n?$/, '');
  const fmBlock = theirsBlock.replace(/---\r?\n?$/, `${yaml}---\n`);
  return { fmBlock, fieldConflicts };
}

/**
 * 3-way body merge via `git merge-file`. Overlapping edits produce standard
 * conflict markers labeled site/wiki-base/wiki in the merged output.
 * @returns {{ merged: string, conflicted: boolean }}
 */
export function mergeBody(oursBody, baseBody, theirsBody) {
  const dir = mkdtempSync(join(tmpdir(), 'wiki-sync-'));
  try {
    const o = join(dir, 'ours');
    const b = join(dir, 'base');
    const t = join(dir, 'theirs');
    writeFileSync(o, oursBody);
    writeFileSync(b, baseBody);
    writeFileSync(t, theirsBody);
    try {
      const merged = execFileSync('git', ['merge-file', '-p', '-L', 'site', '-L', 'wiki-base', '-L', 'wiki', o, b, t], {
        encoding: 'utf8',
      });
      return { merged, conflicted: false };
    } catch (err) {
      // git merge-file exits with the number of conflicts (>0) — stdout still has the merge.
      if (typeof err.status === 'number' && err.status > 0 && typeof err.stdout === 'string') {
        return { merged: err.stdout, conflicted: true };
      }
      throw err;
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Keep only pages whose nested `review.status` is audited. Pure: takes {name, content}. */
export function auditedOnly(files) {
  const audited = [];
  let skipped = 0;
  for (const { name, content } of files) {
    let fm;
    try {
      fm = matter(content).data;
    } catch (err) {
      console.warn(`  ⚠ ${name}: front matter parse failed (${err.message}), skipping.`);
      skipped++;
      continue;
    }
    if (fm.review?.status !== 'audited') {
      skipped++;
      continue;
    }
    audited.push({ name, content });
  }
  return { audited, skipped };
}

/**
 * Classify the sync work. Inputs:
 *   wikiAudited: [{siteKey, wikiRel, content}]   — audited wiki pages, mapped to site paths
 *   wikiAllRels: Set of every wiki page rel path (audited or not) — distinguishes deleted vs demoted
 *   siteKeys:    Set of existing site content paths ('guides/x.md')
 *   state:       { pages: { siteKey: {wikiPath, baseSha} } }
 */
export function classifyPages({ wikiAudited, wikiAllRels, siteKeys, state }) {
  const statePages = state?.pages || {};
  const wikiBySiteKey = new Map(wikiAudited.map((p) => [p.siteKey, p]));

  const newPages = [];
  const merges = [];
  for (const page of wikiAudited) {
    if (!siteKeys.has(page.siteKey)) newPages.push(page);
    else if (statePages[page.siteKey]?.baseSha) merges.push({ ...page, baseSha: statePages[page.siteKey].baseSha });
    else merges.push({ ...page, baseSha: null }); // no recorded base → keep-ours fallback, reported
  }

  const siteOnly = [];
  const removed = [];
  for (const siteKey of siteKeys) {
    if (wikiBySiteKey.has(siteKey)) continue;
    const entry = statePages[siteKey];
    if (!entry) {
      siteOnly.push(siteKey); // site-native page (e.g. GEO) — never touched
    } else {
      const reason = wikiAllRels.has(entry.wikiPath) ? 'demoted (no longer audited)' : 'deleted from wiki';
      removed.push({ siteKey, wikiPath: entry.wikiPath, reason });
    }
  }
  return { newPages, merges, siteOnly, removed };
}

const CONFLICT_MARKER_RE = /^(<{7} |={7}$|>{7} )/m;

/** True if the text contains git conflict markers. */
export function hasConflictMarkers(text) {
  return CONFLICT_MARKER_RE.test(text);
}

/** Render the sync report (PR body + step summary). */
export function renderSyncReport({ wikiSha, results, removed, siteOnly }) {
  const conflicted = results.filter((r) => r.conflicted);
  const fieldConflicts = results.filter((r) => r.fieldConflicts?.length);
  const noBase = results.filter((r) => r.noBase);
  const clean = results.filter((r) => !r.conflicted && !r.noBase && !r.isNew);
  const added = results.filter((r) => r.isNew);

  const lines = [
    `Automated **non-destructive** sync of \`review.status: audited\` wiki content (wiki \`${wikiSha.slice(0, 7)}\`).`,
    'Site-owned frontmatter (`' + SITE_OWNED_FIELDS.join('`/`') + '`) and site-native pages are preserved; bodies are 3-way merged.',
    '',
    `| | pages |`,
    `|---|---|`,
    `| ✅ merged cleanly | ${clean.length} |`,
    `| 🆕 new from wiki | ${added.length} |`,
    `| ⚠️ **body conflicts (resolve in this PR)** | ${conflicted.length} |`,
    `| 🚧 no merge base (site version kept) | ${noBase.length} |`,
    `| 🗑️ wiki source gone (NOT deleted — confirm) | ${removed.length} |`,
    `| 🏠 site-native (untouched) | ${siteOnly.length} |`,
    '',
  ];
  if (conflicted.length) {
    lines.push('### ⚠️ Body conflicts — human resolution required');
    lines.push('These files contain `<<<<<<< site` / `>>>>>>> wiki` markers. CI stays red until they are resolved and committed to this branch.');
    for (const r of conflicted) lines.push(`- \`${r.siteKey}\``);
    lines.push('');
  }
  if (fieldConflicts.length) {
    lines.push('### ⚠️ Site-side frontmatter values overridden by wiki');
    lines.push('These fields DIVERGED between site and wiki; the wiki (canonical) value was applied. If the site value should win, port it to the wiki or restore it in this PR:');
    for (const r of fieldConflicts)
      for (const fc of r.fieldConflicts)
        lines.push(`- \`${r.siteKey}\` field \`${fc.field}\` — site had: \`${JSON.stringify(fc.siteValue).slice(0, 120)}\``);
    lines.push('');
  }
  if (noBase.length) {
    lines.push('### 🚧 No recorded merge base');
    lines.push('No `wiki-sync-state.json` entry — the site version was kept unchanged and wiki changes were NOT applied. Sync manually or backfill a base:');
    for (const r of noBase) lines.push(`- \`${r.siteKey}\``);
    lines.push('');
  }
  if (removed.length) {
    lines.push('### 🗑️ Wiki source removed/demoted (page kept on site)');
    for (const r of removed) lines.push(`- \`${r.siteKey}\` — wiki \`${r.wikiPath}\` ${r.reason}. Delete the site page in this PR if it should go.`);
    lines.push('');
  }
  lines.push('Review the diff + CI preview, resolve anything flagged above, then merge to publish.');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Impure helpers
// ---------------------------------------------------------------------------

function cloneOrPull() {
  if (existsSync(join(TEMP_DIR, '.git'))) {
    console.log('Updating wiki clone...');
    // The 3-way merge base lookup needs history — unshallow legacy caches.
    const shallow = execSync('git rev-parse --is-shallow-repository', { cwd: TEMP_DIR, encoding: 'utf8' }).trim();
    if (shallow === 'true') execSync('git fetch --unshallow', { cwd: TEMP_DIR, stdio: 'inherit' });
    execSync('git pull --ff-only', { cwd: TEMP_DIR, stdio: 'inherit' });
  } else {
    console.log('Cloning wiki repo (full history — merge bases live in old commits)...');
    if (existsSync(TEMP_DIR)) rmSync(TEMP_DIR, { recursive: true });
    execSync(`git clone ${WIKI_REPO} ${TEMP_DIR}`, { stdio: 'inherit' });
  }
}

/** The wiki repo has nested content under either wiki/ or foreigner-visiting-china-wiki/wiki/. */
const WIKI_PREFIXES = ['wiki', 'foreigner-visiting-china-wiki/wiki'];

function currentWikiRoot() {
  for (const p of WIKI_PREFIXES) if (existsSync(join(TEMP_DIR, p, 'concepts'))) return join(TEMP_DIR, p);
  throw new Error('wiki layout not recognized: no <prefix>/concepts directory found');
}

/** Read a wiki file at a historical commit, tolerating both layout prefixes. */
function showWikiFileAt(sha, rel) {
  for (const p of WIKI_PREFIXES) {
    try {
      return execFileSync('git', ['show', `${sha}:${p}/${rel}`], { cwd: TEMP_DIR, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    } catch {
      /* try next prefix */
    }
  }
  return null;
}

function readDirFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((name) => ({ name, content: readFileSync(join(dir, name), 'utf-8') }));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('=== Non-destructive wiki→site content sync ===\n');

  try {
    cloneOrPull();
  } catch (err) {
    console.error(`\n❌ Failed to fetch wiki content: ${err.message}`);
    process.exit(1);
  }

  const wikiRoot = currentWikiRoot();
  const wikiSha = execSync('git rev-parse HEAD', { cwd: TEMP_DIR, encoding: 'utf8' }).trim();
  console.log(`Wiki HEAD: ${wikiSha}\n`);

  // Collect audited pages + the full wiki page set (for deleted-vs-demoted).
  const wikiAudited = [];
  const wikiAllRels = new Set();
  let totalSkipped = 0;
  for (const { collection, wikiDir } of COLLECTIONS) {
    const files = readDirFiles(join(wikiRoot, wikiDir));
    for (const f of files) wikiAllRels.add(`${wikiDir}/${f.name}`);
    const { audited, skipped } = auditedOnly(files);
    totalSkipped += skipped;
    for (const { name, content } of audited) {
      wikiAudited.push({ siteKey: `${collection}/${name}`, wikiRel: `${wikiDir}/${name}`, collection, content });
    }
    console.log(`  ${collection}: ${audited.length} audited, ${skipped} skipped`);
  }

  // #4 — never publish an empty site. Abort before any write.
  if (wikiAudited.length === 0) {
    console.error('\n❌ 0 audited pages found — aborting WITHOUT modifying src/content/.');
    console.error('   Likely: wiki unreachable, all pages draft, or front-matter schema drift.');
    process.exit(1);
  }

  const state = existsSync(STATE_PATH) ? JSON.parse(readFileSync(STATE_PATH, 'utf8')) : { pages: {} };
  const siteKeys = new Set();
  for (const { collection } of COLLECTIONS) {
    for (const { name } of readDirFiles(join(CONTENT_DIR, collection))) siteKeys.add(`${collection}/${name}`);
  }

  const plan = classifyPages({ wikiAudited, wikiAllRels, siteKeys, state });
  const categoryOf = Object.fromEntries(COLLECTIONS.map((c) => [c.collection, c.category]));
  const results = [];

  // New pages: wiki content verbatim + category injection.
  for (const page of plan.newPages) {
    const { fmBlock, fieldConflicts } = mergeFrontmatter('---\n---\n', page.content, { defaultCategory: categoryOf[page.collection] });
    const { body } = splitFrontmatter(page.content);
    mkdirSync(join(CONTENT_DIR, page.collection), { recursive: true });
    writeFileSync(join(CONTENT_DIR, page.siteKey), fmBlock + body);
    state.pages[page.siteKey] = { wikiPath: page.wikiRel, baseSha: wikiSha };
    results.push({ siteKey: page.siteKey, isNew: true, conflicted: false, fieldConflicts });
    console.log(`  🆕 ${page.siteKey}`);
  }

  // Merges: ownership frontmatter merge + 3-way body merge.
  for (const page of plan.merges) {
    const oursRaw = readFileSync(join(CONTENT_DIR, page.siteKey), 'utf8');
    if (!page.baseSha) {
      results.push({ siteKey: page.siteKey, noBase: true, conflicted: false });
      console.log(`  🚧 ${page.siteKey} — no merge base, site version kept`);
      continue;
    }
    const baseRaw = showWikiFileAt(page.baseSha, page.wikiRel) ?? showWikiFileAt(page.baseSha, state.pages[page.siteKey]?.wikiPath);
    if (baseRaw === null) {
      results.push({ siteKey: page.siteKey, noBase: true, conflicted: false });
      console.log(`  🚧 ${page.siteKey} — base ${page.baseSha.slice(0, 7)} unreadable, site version kept`);
      continue;
    }
    const { fmBlock, fieldConflicts } = mergeFrontmatter(oursRaw, page.content, { defaultCategory: categoryOf[page.collection] });
    const { merged, conflicted } = mergeBody(splitFrontmatter(oursRaw).body, splitFrontmatter(baseRaw).body, splitFrontmatter(page.content).body);
    writeFileSync(join(CONTENT_DIR, page.siteKey), fmBlock + merged);
    state.pages[page.siteKey] = { wikiPath: page.wikiRel, baseSha: wikiSha };
    results.push({ siteKey: page.siteKey, conflicted, fieldConflicts });
    console.log(`  ${conflicted ? '⚠️  CONFLICT' : '✅'} ${page.siteKey}`);
  }

  for (const r of plan.removed) console.log(`  🗑️  ${r.siteKey} — ${r.reason} (kept; confirm in PR)`);

  // Persist state (sorted for stable diffs) + report.
  state.pages = Object.fromEntries(Object.entries(state.pages).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n');
  const report = renderSyncReport({ wikiSha, results, removed: plan.removed, siteOnly: plan.siteOnly });
  writeFileSync(REPORT_PATH, report);

  const conflicts = results.filter((r) => r.conflicted).length;
  console.log(`\nDone. ${results.length} pages written, ${conflicts} with conflicts, ${plan.siteOnly.length} site-native untouched.`);
  if (conflicts) console.log('⚠️  Conflicts left as markers — the sync PR stays red until a human resolves them.');
}

if (import.meta.url === `file://${process.argv[1]}`) main();
