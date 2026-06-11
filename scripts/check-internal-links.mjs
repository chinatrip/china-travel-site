// Build-time guard: fail if any internal link in the built HTML lacks a trailing
// slash. Pages are emitted in directory format (canonical = `/apps/`), so any
// internal link to `/apps` (no slash) triggers a 307 on Cloudflare Pages and
// splits canonical signals. This scans dist/ and exits non-zero on offenders.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LICENSE_URL } from '../src/lib/llms.mjs';

const DIST = 'dist';

// Per-page markdown products (issue #56): every guides/apps content page must
// ship a `/<base>/<slug>.md` sibling — the worker serves it for
// `Accept: text/markdown` content negotiation — with the same hygiene rules
// as the llms feeds (no wiki comments, no unresolved wikilinks) plus an H1
// and the License line.
export function checkMarkdownProducts() {
  const problems = [];
  for (const base of ['guides', 'apps']) {
    const dir = join(DIST, base);
    let dirents;
    try {
      dirents = readdirSync(dir, { withFileTypes: true });
    } catch {
      problems.push(`${dir}/ not found — run \`npm run build\` first.`);
      continue;
    }
    for (const d of dirents) {
      if (!d.isDirectory()) continue; // each subdirectory is one content page
      const mdPath = join(dir, `${d.name}.md`);
      let md;
      try {
        md = readFileSync(mdPath, 'utf8');
      } catch {
        problems.push(`${join(dir, d.name)}/ has no markdown sibling ${mdPath}`);
        continue;
      }
      if (!md.startsWith('# ')) problems.push(`${mdPath} must start with an H1`);
      if (!md.includes(`License: ${LICENSE_URL}`))
        problems.push(`${mdPath} is missing the License line`);
      for (const marker of ['<!--', '[[wiki/']) {
        if (md.includes(marker)) problems.push(`${mdPath} contains "${marker}"`);
      }
    }
  }
  return problems;
}

function walkHtml(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walkHtml(p));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

// An internal route link missing its trailing slash. Excludes external links,
// protocol-relative, asset/build paths, the root, and files with extensions.
export function isOffender(href) {
  if (!href.startsWith('/') || href.startsWith('//')) return false;
  if (href.startsWith('/_astro/') || href.includes('cdn-cgi')) return false;
  let cut = href.length;
  const h = href.indexOf('#');
  const q = href.indexOf('?');
  if (h !== -1) cut = Math.min(cut, h);
  if (q !== -1) cut = Math.min(cut, q);
  const path = href.slice(0, cut);
  if (path === '/' || path === '') return false;
  const lastSeg = path.split('/').pop();
  if (lastSeg && lastSeg.includes('.')) return false; // a file (e.g. /llms.txt)
  return !path.endsWith('/');
}

function main() {
  let files;
  try {
    files = walkHtml(DIST);
  } catch {
    console.error(`❌ ${DIST}/ not found — run \`npm run build\` first.`);
    process.exit(2);
  }
  const hrefRe = /href="([^"]*)"/g;
  const byHref = new Map();
  for (const f of files) {
    // Strip script/style so client-side string-built hrefs don't false-positive.
    const html = readFileSync(f, 'utf8')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '');
    let m;
    while ((m = hrefRe.exec(html)) !== null) {
      if (isOffender(m[1])) {
        if (!byHref.has(m[1])) byHref.set(m[1], new Set());
        byHref.get(m[1]).add(f);
      }
    }
  }
  // Also scan text endpoints (e.g. llms.txt) for absolute site URLs missing a
  // slash, and for internal wiki syntax that must never leak into the
  // AI-facing feeds (regressions caught in PR #50 review).
  const absRe = /https:\/\/chinaguide\.ai(\/[^\s)\]"'<>]*)/g;
  const leaks = [];
  for (const txt of ['llms.txt', 'llms-full.txt']) {
    let content;
    try {
      content = readFileSync(join(DIST, txt), 'utf8');
    } catch {
      continue;
    }
    let m;
    while ((m = absRe.exec(content)) !== null) {
      if (isOffender(m[1])) {
        const key = 'https://chinaguide.ai' + m[1];
        if (!byHref.has(key)) byHref.set(key, new Set());
        byHref.get(key).add(join(DIST, txt));
      }
    }
    for (const marker of ['<!--', '[[wiki/']) {
      if (content.includes(marker)) leaks.push(`${join(DIST, txt)} contains "${marker}"`);
    }
  }

  if (leaks.length) {
    console.error(`❌ Internal syntax leaked into AI text feeds:`);
    for (const l of leaks) console.error(`  ${l}`);
    process.exit(1);
  }

  const mdProblems = checkMarkdownProducts();
  if (mdProblems.length) {
    console.error(`❌ ${mdProblems.length} markdown product problem(s):`);
    for (const p of mdProblems) console.error(`  ${p}`);
    process.exit(1);
  }

  if (byHref.size) {
    console.error(`❌ ${byHref.size} internal link(s) without trailing slash:`);
    for (const [href, fileset] of byHref) {
      console.error(`  ${href}  — ${fileset.size} file(s), e.g. ${[...fileset][0]}`);
    }
    process.exit(1);
  }
  console.log('✅ All internal links use trailing slashes.');
  console.log('✅ Every content page ships a clean markdown sibling.');
}

main();
