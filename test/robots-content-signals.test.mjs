import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const robotsPath = fileURLToPath(new URL('../public/robots.txt', import.meta.url));
const robots = readFileSync(robotsPath, 'utf8');
const lines = robots.split('\n');

const isUserAgent = (l) => /^User-agent:/i.test(l.trim());
const isContentSignal = (l) => /^Content-Signal:/i.test(l.trim());
const isComment = (l) => l.trim().startsWith('#');

// Parse into RFC 9309 groups. A group starts at a User-agent line and ends at
// the next User-agent line that opens a new group (NOT at blank lines — blank
// lines carry no grouping semantics in RFC 9309, so a reshuffled file cannot
// fool these assertions). Consecutive User-agent lines with no directives in
// between share one group. Comments and blank lines are ignored.
function parseGroups(allLines) {
  const groups = [];
  let current = null;
  for (const raw of allLines) {
    const line = raw.trim();
    if (line === '' || isComment(raw)) continue;
    if (isUserAgent(raw)) {
      const agent = line.replace(/^User-agent:/i, '').trim();
      if (current && current.directives.length === 0) {
        current.agents.push(agent); // multiple UA lines heading one group
      } else {
        current = { agents: [agent], directives: [] };
        groups.push(current);
      }
    } else if (current) {
      current.directives.push(line);
    }
  }
  return groups;
}

const groups = parseGroups(lines);
const EXPECTED_SIGNALS = { search: 'yes', 'ai-input': 'yes', 'ai-train': 'no' };

// ---------- every group carries the signal ----------
// Content Signals have NO fallback/inheritance semantics: RFC 9309 §2.2.1 makes
// a crawler obey only its most specific matching group (the * group applies
// only when nothing else matches), and contentsignals.org clause (c) says a
// missing signal "neither grants nor restricts". So the signal line must be
// present in EVERY group, or the explicitly-allowed AI crawlers see no signal.

test('every User-agent group carries exactly one Content-Signal line', () => {
  assert.ok(groups.length > 0, 'robots.txt must contain User-agent groups');
  assert.ok(
    groups.some((g) => g.agents.includes('*')),
    'the wildcard (*) group must exist',
  );
  for (const g of groups) {
    const signals = g.directives.filter(isContentSignal);
    assert.equal(
      signals.length,
      1,
      `group [${g.agents.join(', ')}] must carry exactly one Content-Signal line, found ${signals.length}`,
    );
  }
});

test('all Content-Signal lines are byte-identical (no per-group drift)', () => {
  const signalLines = groups.flatMap((g) => g.directives.filter(isContentSignal));
  assert.equal(signalLines.length, groups.length, 'one signal line per group');
  const unique = new Set(signalLines);
  assert.equal(unique.size, 1, `expected one canonical line, got: ${[...unique].join(' | ')}`);
});

test('no Content-Signal line exists outside a User-agent group', () => {
  const inFile = lines.filter(isContentSignal).length;
  const inGroups = groups.flatMap((g) => g.directives.filter(isContentSignal)).length;
  assert.equal(inFile, inGroups, 'every Content-Signal line must sit inside some group');
});

// ---------- values ----------

test('Content-Signal declares exactly search=yes, ai-input=yes, ai-train=no', () => {
  const signalLines = [...new Set(lines.filter(isContentSignal).map((l) => l.trim()))];
  assert.equal(signalLines.length, 1, 'one canonical Content-Signal line');
  const value = signalLines[0].replace(/^Content-Signal:/i, '');
  const signals = value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.split('=').map((p) => p.trim().toLowerCase()));
  assert.deepEqual(Object.fromEntries(signals), EXPECTED_SIGNALS);
  assert.equal(signals.length, 3, 'exactly three signals, no duplicates');
});

// ---------- regression: nothing else got dropped ----------

test('robots.txt still declares the sitemap and the GPTBot group', () => {
  assert.ok(
    robots.includes('Sitemap: https://chinaguide.ai/sitemap-index.xml'),
    'Sitemap line must survive',
  );
  assert.ok(
    groups.some((g) => g.agents.includes('GPTBot')),
    'GPTBot group must survive',
  );
});
