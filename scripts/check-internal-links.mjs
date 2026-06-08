// Build-time guard: fail if any internal link in the built HTML lacks a trailing
// slash. Pages are emitted in directory format (canonical = `/apps/`), so any
// internal link to `/apps` (no slash) triggers a 307 on Cloudflare Pages and
// splits canonical signals. This scans dist/ and exits non-zero on offenders.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

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
  if (byHref.size) {
    console.error(`❌ ${byHref.size} internal link(s) without trailing slash:`);
    for (const [href, fileset] of byHref) {
      console.error(`  ${href}  — ${fileset.size} file(s), e.g. ${[...fileset][0]}`);
    }
    process.exit(1);
  }
  console.log('✅ All internal links use trailing slashes.');
}

main();
