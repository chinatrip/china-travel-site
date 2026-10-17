// Freshness gate: every published English content page carries a `last_verified`
// date and a `volatility` level, and the site promises each page is re-verified
// inside that window. The wiki repo already enforces this for wiki-managed pages,
// but two pages are site-native and nothing checked the site's own copies — a
// 135-day-old high-volatility page shipped while the homepage still said
// "Updated weekly".
//
// Thresholds mirror the wiki's lint_helper.py (STALE_DAYS).
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

// ES translations are deliberately NOT listed: their freshness is governed by
// check-translation-freshness.mjs, which compares `source_last_verified` against
// the English source's `last_verified`. Double-gating them on the translation's
// own date would fail every time the English page is re-verified.
const DIRS = ['src/content/guides', 'src/content/apps'];
const DEFAULT_VOLATILITY = 'medium';
export const STALE_DAYS = { high: 90, medium: 180, low: 365 };

function daysBetween(a, b) {
  return Math.floor((a.getTime() - b.getTime()) / 86_400_000);
}

export function checkFreshness({ dirs = DIRS, today = new Date() } = {}) {
  const problems = [];
  for (const dir of dirs) {
    let files;
    try {
      files = readdirSync(dir);
    } catch {
      problems.push(`${dir}/ not found`);
      continue;
    }
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const path = join(dir, file);
      const text = readFileSync(path, 'utf8');
      const verified = text.match(/^last_verified:\s*"?(\d{4}-\d{2}-\d{2})"?\s*$/m);
      if (!verified) {
        problems.push(`${path}: missing last_verified`);
        continue;
      }
      const volatility = text.match(/^volatility:\s*"?([a-z]+)"?\s*$/m)?.[1] ?? DEFAULT_VOLATILITY;
      const limit = STALE_DAYS[volatility] ?? STALE_DAYS[DEFAULT_VOLATILITY];
      const age = daysBetween(today, new Date(`${verified[1]}T00:00:00Z`));
      if (age > limit) {
        problems.push(`${path}: ${age}d old (${volatility}, limit ${limit}d)`);
      }
    }
  }
  return problems;
}

function main() {
  const problems = checkFreshness();
  if (problems.length) {
    console.error(`❌ ${problems.length} content page(s) past their re-verification window:`);
    for (const p of problems) console.error(`  ${p}`);
    console.error('  Re-verify the page and bump last_verified, or lower its volatility with justification.');
    process.exit(1);
  }
  console.log('✅ Every content page is inside its re-verification window.');
}

// Import-guard so tests can use checkFreshness() without running the CLI.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
