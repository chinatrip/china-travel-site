import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeInternalUrl } from '../src/plugins/remark-trailing-slash.mjs';

test('adds trailing slash to internal route links', () => {
  assert.equal(normalizeInternalUrl('/guides/sim-card'), '/guides/sim-card/');
  assert.equal(normalizeInternalUrl('/apps/didi'), '/apps/didi/');
});

test('keeps the slash before an anchor or query string', () => {
  assert.equal(
    normalizeInternalUrl('/guides/transportation#city-by-city-metro-apps'),
    '/guides/transportation/#city-by-city-metro-apps',
  );
  assert.equal(normalizeInternalUrl('/checklist?from=nav'), '/checklist/?from=nav');
});

test('is idempotent on already-normalized links and the root', () => {
  assert.equal(normalizeInternalUrl('/apps/didi/'), '/apps/didi/');
  assert.equal(normalizeInternalUrl('/'), '/');
});

test('leaves external, protocol-relative, asset and file links untouched', () => {
  assert.equal(normalizeInternalUrl('https://example.com'), 'https://example.com');
  assert.equal(normalizeInternalUrl('//cdn.example.com/x'), '//cdn.example.com/x');
  assert.equal(normalizeInternalUrl('/llms.txt'), '/llms.txt');
  assert.equal(normalizeInternalUrl('/_astro/app.css'), '/_astro/app.css');
});
