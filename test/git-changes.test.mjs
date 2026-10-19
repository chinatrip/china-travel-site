import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseChangesLog, collectionOf, snapshotChanges } from '../src/lib/git-changes.mjs';

// Header format is %x00%H%x00%cI%x00%s, followed by --name-only paths.
const SAMPLE = [
  '\x00abc123\x002026-10-18T07:22:22+00:00\x00content: fix sim-card facts',
  'src/content/guides/sim-card.md',
  'src/content/guides/es/city-guides.md',
  '',
  '\x00def456\x002026-10-17T03:00:00+00:00\x00chore: unrelated code change',
  'src/lib/facts.mjs',
  '',
  '\x00ghi789\x002026-10-16T01:00:00+00:00\x00update app page',
  'src/content/apps/tenpaygo.md',
  '',
].join('\n');

test('parseChangesLog keeps commits that touch content markdown only', () => {
  const entries = parseChangesLog(SAMPLE);
  assert.equal(entries.length, 2);
  assert.equal(entries[0].commit, 'abc123');
  assert.equal(entries[0].date, '2026-10-18');
  assert.equal(entries[0].subject, 'content: fix sim-card facts');
  assert.deepEqual(
    entries[0].files.map((f) => [f.collection, f.slug]),
    [
      ['guides', 'sim-card'],
      ['guidesEs', 'city-guides'],
    ],
  );
  assert.equal(entries[1].files[0].slug, 'tenpaygo');
});

test('parseChangesLog builds the same public URLs as the page models', () => {
  const [entry] = parseChangesLog(SAMPLE);
  assert.equal(entry.files[0].url, 'https://chinaguide.ai/guides/sim-card/');
  assert.equal(entry.files[0].json_url, 'https://chinaguide.ai/guides/sim-card.json');
  assert.equal(entry.files[1].json_url, 'https://chinaguide.ai/es/guides/city-guides.json');
});

test('parseChangesLog tolerates empty/garbage input', () => {
  assert.deepEqual(parseChangesLog(''), []);
  assert.deepEqual(parseChangesLog(undefined), []);
  assert.deepEqual(parseChangesLog('not a header\nsrc/content/guides/x.md'), []);
});

test('collectionOf classifies the three content trees', () => {
  assert.equal(collectionOf('src/content/guides/es/city-guides.md'), 'guidesEs');
  assert.equal(collectionOf('src/content/guides/sim-card.md'), 'guides');
  assert.equal(collectionOf('src/content/apps/tenpaygo.md'), 'apps');
});

test('snapshotChanges is a labelled fallback, newest first', () => {
  const models = [
    { slug: 'a', collection: 'guides', title: 'A', last_verified: '2026-10-01', url: 'u', json_url: 'j' },
    { slug: 'b', collection: 'apps', title: 'B', last_verified: '2026-10-10', url: 'u2', json_url: 'j2' },
    { slug: 'c', collection: 'guides', title: 'C', last_verified: null, url: 'u3', json_url: 'j3' },
  ];
  const entries = snapshotChanges(models);
  assert.equal(entries.length, 2);
  assert.equal(entries[0].files[0].slug, 'b');
  assert.equal(entries[0].commit, null);
  assert.match(entries[0].subject, /^Verified: /);
});
