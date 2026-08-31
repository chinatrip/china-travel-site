import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseGitLog, repoState, contentCommitDates } from '../src/lib/git-dates.mjs';

// The sitemap's <lastmod> means "when did this file last change", so the only
// honest source for it is the content file's last commit. These tests pin the
// parsing of `git log --name-only` and the two environments where the answer is
// NOT available — because getting those wrong ships wrong dates that look right.

const LOG = [
  '\x002026-08-21T09:10:00Z',
  'src/content/guides/sim-card.md',
  'src/content/guides/internet-connectivity.md',
  '',
  '\x002026-08-20T04:00:00Z',
  'src/content/guides/sim-card.md',
  'src/content/apps/amap.md',
  '',
  '\x002026-06-18T02:00:00Z',
  'src/content/apps/amap.md',
  '',
].join('\n');

test('parseGitLog keeps the newest commit touching each path', () => {
  const dates = parseGitLog(LOG);
  // git log is newest-first, so the FIRST sighting of a path is its latest change.
  assert.equal(dates.get('src/content/guides/sim-card.md'), '2026-08-21T09:10:00Z');
  assert.equal(dates.get('src/content/apps/amap.md'), '2026-08-20T04:00:00Z');
  assert.equal(dates.get('src/content/guides/internet-connectivity.md'), '2026-08-21T09:10:00Z');
  assert.equal(dates.size, 3);
});

test('parseGitLog tolerates empty and malformed input', () => {
  assert.equal(parseGitLog('').size, 0);
  assert.equal(parseGitLog(undefined).size, 0);
  // Paths before any commit header have no date and must be dropped, not guessed.
  assert.equal(parseGitLog('src/content/guides/orphan.md\n').size, 0);
});

test('parseGitLog does not mistake a path for a commit header', () => {
  // The header marker is a NUL prefix precisely because no path can start with one.
  const dates = parseGitLog('\x002026-08-21T00:00:00Z\ncommit 2026-01-01/notes.md\n');
  assert.equal(dates.get('commit 2026-01-01/notes.md'), '2026-08-21T00:00:00Z');
  assert.equal(dates.size, 1);
});

test('repoState reports this checkout as a full repository', () => {
  // If this ever reads 'shallow' locally, the dates below would be silently wrong.
  assert.equal(repoState({ cwd: new URL('..', import.meta.url).pathname }), 'full');
});

test('repoState reports absent outside a git repository', () => {
  assert.equal(repoState({ cwd: '/' }), 'absent');
});

test('contentCommitDates throws on a shallow repository rather than returning wrong dates', () => {
  // A shallow clone answers every `git log -- <file>` with the tip commit, which
  // is a plausible-looking wrong date. Failing loudly is the only safe behaviour;
  // this is what would catch a CI checkout losing its `fetch-depth: 0`.
  assert.throws(
    () => contentCommitDates(['src/content/guides'], { cwd: '/tmp', stateOverride: 'shallow' }),
    /shallow/i,
  );
});

test('contentCommitDates returns an empty map (not an error) outside a repository', () => {
  // Building from a tarball is a legitimate environment; the caller falls back.
  assert.equal(contentCommitDates(['src/content/guides'], { cwd: '/', stateOverride: 'absent' }).size, 0);
});

test('contentCommitDates resolves the real dates of this repository', () => {
  const root = new URL('..', import.meta.url).pathname;
  const dates = contentCommitDates(['src/content/guides', 'src/content/apps'], { cwd: root });
  // The scan is by directory, so it also picks up non-markdown residents of those
  // folders (.gitkeep, wiki-sync-state.json). Harmless — the map is looked up by
  // path — but the markdown entries are the ones that must all be there and dated.
  const markdown = [...dates].filter(([path]) => path.endsWith('.md'));
  assert.ok(markdown.length >= 40, `expected every content file to resolve, got ${markdown.length}`);
  for (const [path, iso] of markdown) {
    assert.match(path, /^src\/content\/(guides|apps)\/.+\.md$/);
    assert.match(iso, /^\d{4}-\d{2}-\d{2}T/, `${path} must carry an ISO commit date`);
  }
  // The Spanish subfolder is inside guides/ and must come along.
  assert.ok(
    [...dates.keys()].some((p) => p.startsWith('src/content/guides/es/')),
    'Spanish content files must be covered',
  );
});
