#!/usr/bin/env node
/**
 * CI guard: fail if any content file contains git conflict markers.
 *
 * The non-destructive wiki sync (scripts/sync-content.mjs) intentionally leaves
 * `<<<<<<< site` / `>>>>>>> wiki` markers in files whose body changed on both
 * sides — a human must resolve them in the sync PR. Conflict markers are valid
 * markdown, so Astro would happily BUILD and SHIP them; this check is what
 * actually turns the PR red until they're gone.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { hasConflictMarkers } from './sync-content.mjs';

const CONTENT_DIRS = ['src/content/guides', 'src/content/apps'];

const offenders = [];
for (const dir of CONTENT_DIRS) {
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.md')) continue;
    const path = join(dir, f);
    if (hasConflictMarkers(readFileSync(path, 'utf8'))) offenders.push(path);
  }
}

if (offenders.length) {
  console.error(`❌ ${offenders.length} content file(s) contain unresolved merge conflict markers:`);
  for (const p of offenders) console.error(`   ${p}`);
  console.error('   Resolve the <<<<<<< site / >>>>>>> wiki sections, commit, and re-run.');
  process.exit(1);
}
console.log('✅ No conflict markers in content.');
