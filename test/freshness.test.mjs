import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkFreshness, STALE_DAYS } from '../scripts/check-freshness.mjs';

function page(dir, name, { verified, volatility }) {
  mkdirSync(dir, { recursive: true });
  const lines = ['---', `last_verified: ${verified}`];
  if (volatility) lines.push(`volatility: ${volatility}`);
  lines.push('---', '');
  writeFileSync(join(dir, name), lines.join('\n'));
}

test('thresholds match the wiki lint_helper: 90 / 180 / 365 days', () => {
  assert.deepEqual(STALE_DAYS, { high: 90, medium: 180, low: 365 });
});

test('flags pages past their volatility window and passes pages inside it', () => {
  const root = mkdtempSync(join(tmpdir(), 'freshness-'));
  const dir = join(root, 'guides');
  page(dir, 'fresh-high.md', { verified: '2026-10-01', volatility: 'high' });
  page(dir, 'stale-high.md', { verified: '2026-06-01', volatility: 'high' }); // 138d
  page(dir, 'stale-medium.md', { verified: '2026-01-01', volatility: 'medium' }); // 289d
  page(dir, 'fresh-low.md', { verified: '2025-12-01', volatility: 'low' }); // 320d < 365

  const problems = checkFreshness({ dirs: [dir], today: new Date('2026-10-17T00:00:00Z') });

  assert.equal(problems.length, 2, problems.join('\n'));
  assert.ok(problems.some((p) => p.includes('stale-high')));
  assert.ok(problems.some((p) => p.includes('stale-medium')));
});

test('missing volatility falls back to the medium window, missing date is an error', () => {
  const root = mkdtempSync(join(tmpdir(), 'freshness-'));
  const dir = join(root, 'apps');
  page(dir, 'no-volatility.md', { verified: '2026-09-01' }); // 46d, medium -> fine
  page(dir, 'no-date.md', {});

  const problems = checkFreshness({ dirs: [dir], today: new Date('2026-10-17T00:00:00Z') });
  assert.equal(problems.length, 1);
  assert.ok(problems[0].includes('missing last_verified'));
});
