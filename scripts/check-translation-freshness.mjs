// Build-time guard: fail if a translated page has drifted from its English
// source. Each es/ page records `source_en` + `source_last_verified`; when the
// English source's `last_verified` moves ahead, the translation must be
// re-checked before it can ship — for freshness-critical content (payments,
// visa policy) a stale translation is worse than none. Exits non-zero on any
// stale or misconfigured translation. See src/lib/i18n.mjs (#104).
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { isTranslationStale } from '../src/lib/i18n.mjs';

const CONTENT = 'src/content';
// Collections that can carry an `<collection>/es/` translation subfolder.
const LOCALE_DIRS = [
  ['guides', 'es'],
  ['apps', 'es'],
];

/** Normalize a frontmatter date (YAML may parse it as a Date) to YYYY-MM-DD. */
function isoDate(v) {
  if (!v) return undefined;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).slice(0, 10);
}

export function checkTranslationFreshness() {
  const problems = [];
  for (const [collection, locale] of LOCALE_DIRS) {
    const dir = join(CONTENT, collection, locale);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      const rel = `${collection}/${locale}/${file}`;
      const { data } = matter(readFileSync(join(dir, file), 'utf8'));

      if (!data.source_en) { problems.push(`${rel}: missing \`source_en\``); continue; }
      if (!data.source_last_verified) { problems.push(`${rel}: missing \`source_last_verified\``); continue; }

      const srcPath = join(CONTENT, `${data.source_en}.md`);
      if (!existsSync(srcPath)) {
        problems.push(`${rel}: \`source_en: ${data.source_en}\` → ${srcPath} not found`);
        continue;
      }

      const enLastVerified = isoDate(matter(readFileSync(srcPath, 'utf8')).data.last_verified);
      const translated = isoDate(data.source_last_verified);
      if (isTranslationStale(translated, enLastVerified)) {
        problems.push(
          `${rel}: STALE — English source re-verified ${enLastVerified} but translation tracks ${translated}. ` +
          `Re-check the translation against the source, then bump source_last_verified.`,
        );
      }
    }
  }
  return problems;
}

const problems = checkTranslationFreshness();
if (problems.length) {
  console.error('✖ Translation freshness check failed:');
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log('✅ Translations are current with their English sources.');
