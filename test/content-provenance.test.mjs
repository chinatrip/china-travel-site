import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// The publish gate is `review.status: audited` in the source frontmatter, but the
// site's content schema defaults the top-level `status` to 'audited', so a draft
// page that reached src/content/ would still be listed and built. The sync script
// filters drafts, but site-native pages and manual edits do not go through it.
// This asserts the provenance field itself, for every published content file.

const DIRS = ['src/content/guides', 'src/content/apps', 'src/content/guides/es'];
const PUBLISHABLE = new Set(['audited', 'verified']);

test('every content file carries an explicit audited/verified review.status', () => {
  const offenders = [];
  for (const dir of DIRS) {
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      const text = readFileSync(join(dir, file), 'utf8');
      // Nested under `review:` (two-space indent), never the top-level default.
      const status = text.match(/^ {2}status:\s*"?([a-z-]+)"?\s*$/m)?.[1];
      if (!PUBLISHABLE.has(status)) {
        offenders.push(`${dir}/${file} -> review.status: ${status ?? '(missing)'}`);
      }
    }
  }
  assert.deepEqual(offenders, [], `content files not explicitly audited/verified:\n${offenders.join('\n')}`);
});
