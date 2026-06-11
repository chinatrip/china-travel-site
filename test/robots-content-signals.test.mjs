import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const robotsPath = fileURLToPath(new URL('../public/robots.txt', import.meta.url));
const robots = readFileSync(robotsPath, 'utf8');
const lines = robots.split('\n');

const contentSignalLines = lines.filter((l) => /^Content-Signal:/i.test(l.trim()));

// ---------- presence ----------

test('robots.txt contains exactly one Content-Signal line', () => {
  assert.equal(contentSignalLines.length, 1, 'expected exactly one Content-Signal line');
});

// ---------- placement: inside the User-agent: * group ----------

test('Content-Signal sits inside the User-agent: * group', () => {
  const starIdx = lines.findIndex((l) => l.trim() === 'User-agent: *');
  assert.ok(starIdx !== -1, 'User-agent: * group must exist');
  // The group ends at the next blank line (robots.txt group boundary).
  let groupEnd = lines.findIndex((l, i) => i > starIdx && l.trim() === '');
  if (groupEnd === -1) groupEnd = lines.length;
  const signalIdx = lines.findIndex((l) => /^Content-Signal:/i.test(l.trim()));
  assert.ok(
    signalIdx > starIdx && signalIdx < groupEnd,
    `Content-Signal (line ${signalIdx + 1}) must be inside the User-agent: * group ` +
      `(lines ${starIdx + 1}-${groupEnd})`,
  );
});

// ---------- values ----------

test('Content-Signal declares exactly search=yes, ai-input=yes, ai-train=no', () => {
  assert.equal(contentSignalLines.length, 1);
  const value = contentSignalLines[0].trim().replace(/^Content-Signal:/i, '');
  const signals = value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.split('=').map((p) => p.trim().toLowerCase()));
  assert.deepEqual(Object.fromEntries(signals), {
    search: 'yes',
    'ai-input': 'yes',
    'ai-train': 'no',
  });
  assert.equal(signals.length, 3, 'exactly three signals, no duplicates');
});

// ---------- regression: nothing else got dropped ----------

test('robots.txt still declares the sitemap and the GPTBot group', () => {
  assert.ok(
    robots.includes('Sitemap: https://chinaguide.ai/sitemap-index.xml'),
    'Sitemap line must survive',
  );
  assert.ok(robots.includes('User-agent: GPTBot'), 'GPTBot group must survive');
});
