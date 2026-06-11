import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterExternalSources, formatSourceLabel } from '../src/lib/trust-signals.mjs';

// --- filterExternalSources: only public http(s) URLs reach the page ---

test('keeps http(s) URLs in order', () => {
  assert.deepEqual(
    filterExternalSources([
      'https://en.nia.gov.cn/n147418/n147463/c156086/content.html',
      'http://example.com/page',
    ]),
    [
      'https://en.nia.gov.cn/n147418/n147463/c156086/content.html',
      'http://example.com/page',
    ],
  );
});

test('drops internal wiki/raw provenance entries (not public sources)', () => {
  assert.deepEqual(
    filterExternalSources([
      'raw/realchinaguide-mini-programs-2026.md',
      'wiki/concepts/visa-types.md',
      'https://www.visaforchina.cn',
    ]),
    ['https://www.visaforchina.cn'],
  );
});

test('drops non-http protocols and malformed URLs', () => {
  assert.deepEqual(
    filterExternalSources([
      'ftp://files.example.com/doc.pdf',
      'javascript:alert(1)',
      'https://',
      'https://?q=1',
      '//protocol-relative.example.com',
    ]),
    [],
  );
});

test('drops non-string entries and trims whitespace', () => {
  assert.deepEqual(
    filterExternalSources([null, undefined, 42, {}, '  https://example.com/a  ']),
    ['https://example.com/a'],
  );
});

test('dedupes repeated URLs, keeping first occurrence', () => {
  assert.deepEqual(
    filterExternalSources([
      'https://example.com/a',
      'https://example.com/b',
      'https://example.com/a',
    ]),
    ['https://example.com/a', 'https://example.com/b'],
  );
});

test('returns [] for empty, missing, or non-array input', () => {
  assert.deepEqual(filterExternalSources([]), []);
  assert.deepEqual(filterExternalSources(undefined), []);
  assert.deepEqual(filterExternalSources(null), []);
  assert.deepEqual(filterExternalSources('https://example.com'), []);
});

// --- formatSourceLabel: bare URL -> readable "domain/path" label ---

test('renders hostname + path without protocol', () => {
  assert.equal(
    formatSourceLabel('https://en.nia.gov.cn/n147418/n147463/c156086/content.html'),
    'en.nia.gov.cn/n147418/n147463/c156086/content.html',
  );
});

test('strips a leading www. but not www in the middle of the host', () => {
  assert.equal(formatSourceLabel('https://www.visaforchina.cn'), 'visaforchina.cn');
  assert.equal(
    formatSourceLabel('https://english.www.gov.cn/news/'),
    'english.www.gov.cn/news',
  );
});

test('drops trailing slash, query string, and fragment', () => {
  assert.equal(formatSourceLabel('https://example.com/'), 'example.com');
  assert.equal(formatSourceLabel('https://example.com/path/?q=1#frag'), 'example.com/path');
});

test('truncates long labels with an ellipsis at maxLen', () => {
  const url =
    'https://english.www.gov.cn/news/202412/17/content_WS6760ead6c6d0868f4e8ee0c1.html';
  const label = formatSourceLabel(url); // default maxLen 60
  assert.equal(label.length, 60);
  assert.ok(label.endsWith('…'));
  assert.ok(label.startsWith('english.www.gov.cn/news/'));

  assert.equal(formatSourceLabel(url, 20).length, 20);
  assert.ok(formatSourceLabel(url, 20).endsWith('…'));
});

test('short labels are returned untruncated', () => {
  assert.equal(formatSourceLabel('https://example.com/a', 60), 'example.com/a');
});

test('falls back to the raw string when the URL cannot be parsed', () => {
  assert.equal(formatSourceLabel('not a url'), 'not a url');
});
