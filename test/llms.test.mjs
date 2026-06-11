import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SITE,
  LICENSE_URL,
  SITE_PAGES,
  entryLine,
  stripFrontmatter,
  buildLlmsTxt,
  buildLlmsFullTxt,
} from '../src/lib/llms.mjs';

const entry = (id, title, extra = {}, body = `Body of ${title}.`) => ({
  id,
  data: { title, ...extra },
  body,
});

const guides = [
  entry('visa-types', 'China Visa Types', {
    description: 'Which visa you need.',
    last_verified: '2026-06-01',
  }),
  entry('alipay-setup', 'Alipay Setup', { description: 'Set up Alipay.' }),
];
const apps = [entry('wechat', 'WeChat', { description: 'The everything app.' })];

// ---------- entryLine ----------

test('entryLine renders title, url, description and verified date', () => {
  assert.equal(
    entryLine('guides', guides[0]),
    `- [China Visa Types](${SITE}/guides/visa-types/): Which visa you need. (Verified 2026-06-01)`,
  );
});

test('entryLine omits missing description and date', () => {
  assert.equal(entryLine('apps', entry('didi', 'DiDi')), `- [DiDi](${SITE}/apps/didi/)`);
});

test('entryLine ignores an unparseable last_verified value', () => {
  const e = entry('x', 'X', { last_verified: 'not-a-date' });
  assert.equal(entryLine('guides', e), `- [X](${SITE}/guides/x/)`);
});

// ---------- stripFrontmatter ----------

test('stripFrontmatter removes a leading YAML block', () => {
  const raw = '---\ntitle: "T"\nfaqs:\n  - q: "Q?"\n---\n\n## Heading\n\nBody.\n';
  assert.equal(stripFrontmatter(raw), '## Heading\n\nBody.');
});

test('stripFrontmatter leaves bodies without frontmatter untouched', () => {
  assert.equal(stripFrontmatter('## Heading\n\nBody.'), '## Heading\n\nBody.');
});

test('stripFrontmatter does not eat a thematic break mid-document', () => {
  const raw = 'Intro.\n\n---\n\nAfter break.';
  assert.equal(stripFrontmatter(raw), raw);
});

// ---------- buildLlmsTxt ----------

test('llms.txt carries a License line and a pointer to llms-full.txt', () => {
  const txt = buildLlmsTxt({ guides, apps });
  assert.match(txt, new RegExp(`^License: ${LICENSE_URL}$`, 'm'));
  assert.match(txt, /llms-full\.txt/);
  assert.ok(txt.includes(`${SITE}/llms-full.txt`));
});

test('llms.txt lists the four static site pages and excludes /search/', () => {
  const txt = buildLlmsTxt({ guides, apps });
  for (const url of [`${SITE}/`, `${SITE}/guides/`, `${SITE}/apps/`, `${SITE}/checklist/`]) {
    assert.ok(txt.includes(`](${url})`), `missing site page ${url}`);
  }
  assert.equal(SITE_PAGES.length, 4);
  assert.ok(SITE_PAGES.every((p) => p.description && p.description.length > 0));
  assert.ok(!txt.includes('/search/'), '/search/ must stay excluded');
});

test('llms.txt lists every content entry, sorted by title', () => {
  const txt = buildLlmsTxt({ guides, apps });
  const entries = txt.split('\n').filter((l) => l.startsWith('- ['));
  assert.equal(entries.length, SITE_PAGES.length + guides.length + apps.length);
  const alipay = txt.indexOf('Alipay Setup');
  const visa = txt.indexOf('China Visa Types');
  assert.ok(alipay !== -1 && visa !== -1 && alipay < visa, 'guides sorted by title');
});

// ---------- buildLlmsFullTxt ----------

test('llms-full.txt contains every page title, canonical URL, and body', () => {
  const full = buildLlmsFullTxt({ guides, apps });
  for (const [base, list] of [
    ['guides', guides],
    ['apps', apps],
  ]) {
    for (const e of list) {
      assert.ok(full.includes(`# ${e.data.title}`), `missing title ${e.data.title}`);
      assert.ok(full.includes(`${SITE}/${base}/${e.id}/`), `missing url for ${e.id}`);
      assert.ok(full.includes(e.body), `missing body for ${e.id}`);
    }
  }
  assert.match(full, new RegExp(`^License: ${LICENSE_URL}$`, 'm'));
});

test('llms-full.txt normalizes last_verified to YYYY-MM-DD', () => {
  // YAML date values reach data as verbose Date strings (z.coerce.string());
  // the output must still show an ISO date.
  const e = entry('d', 'Dated', {
    last_verified: 'Tue Jun 09 2026 08:00:00 GMT+0800 (China Standard Time)',
  });
  const full = buildLlmsFullTxt({ guides: [e], apps: [] });
  assert.match(full, /^Last verified: 2026-06-0[89]$/m);
  assert.ok(!full.includes('GMT'), 'verbose date string must not leak');
});

test('llms-full.txt drops a leading H1 duplicating the title header', () => {
  const e = entry('h1', 'My Title', {}, '# My Title\n\nIntro paragraph.\n\n## Section');
  const full = buildLlmsFullTxt({ guides: [e], apps: [] });
  const matches = full.match(/^# My Title$/gm) || [];
  assert.equal(matches.length, 1, 'title must appear as exactly one H1');
  assert.ok(full.includes('Intro paragraph.'));
  assert.ok(full.includes('## Section'));
});

test('llms-full.txt strips frontmatter if a body still carries it', () => {
  const withFm = entry('fm', 'FM Page', {}, '---\ntitle: "leak"\n---\nReal body.');
  const full = buildLlmsFullTxt({ guides: [withFm], apps: [] });
  assert.ok(full.includes('Real body.'));
  assert.ok(!full.includes('title: "leak"'), 'frontmatter must not leak into llms-full.txt');
});
