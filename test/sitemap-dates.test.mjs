import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { buildLastmodMap, lastmodFor } from '../src/lib/sitemap-dates.mjs';
import { contentCommitDates } from '../src/lib/git-dates.mjs';

const SITE = 'https://chinaguide.ai';
const here = dirname(fileURLToPath(import.meta.url));

test('maps guides and apps entries to their routes', () => {
  const map = buildLastmodMap([
    { collection: 'guides', slug: 'visa-types', data: { date: '2026-04-30', last_verified: '2026-06-09' } },
    { collection: 'apps', slug: 'alipay', data: { date: '2026-04-30' } },
  ]);
  assert.equal(map.get('/guides/visa-types/'), '2026-06-09');
  assert.equal(map.get('/apps/alipay/'), '2026-04-30');
});

test('prefers last_verified over date', () => {
  const map = buildLastmodMap([
    { collection: 'guides', slug: 'a', data: { date: '2026-01-01', last_verified: '2026-06-01' } },
  ]);
  assert.equal(map.get('/guides/a/'), '2026-06-01');
});

test('falls back to date when last_verified is missing', () => {
  const map = buildLastmodMap([
    { collection: 'guides', slug: 'a', data: { date: '2026-01-01' } },
  ]);
  assert.equal(map.get('/guides/a/'), '2026-01-01');
});

test('omits entries without any usable date (no fake lastmod)', () => {
  const map = buildLastmodMap([
    { collection: 'guides', slug: 'a', data: {} },
    { collection: 'guides', slug: 'b', data: { date: 'not-a-date' } },
  ]);
  assert.equal(map.has('/guides/a/'), false);
  assert.equal(map.has('/guides/b/'), false);
});

test('normalizes Date objects (YAML auto-parses dates) to YYYY-MM-DD', () => {
  const map = buildLastmodMap([
    { collection: 'apps', slug: 'wechat', data: { last_verified: new Date('2026-06-09T00:00:00.000Z') } },
  ]);
  assert.equal(map.get('/apps/wechat/'), '2026-06-09');
});

test('skips malformed entries instead of throwing', () => {
  const map = buildLastmodMap([
    null,
    { collection: 'guides', data: { date: '2026-01-01' } }, // no slug
    { collection: 'wiki', slug: 'a', data: { date: '2026-01-01' } }, // unknown collection
    { collection: 'guides', slug: 'ok', data: { date: '2026-01-01' } },
  ]);
  assert.equal(map.size, 1);
  assert.equal(map.get('/guides/ok/'), '2026-01-01');
});

test('lastmodFor resolves full URLs against the map', () => {
  const map = new Map([['/guides/visa-types/', '2026-06-09']]);
  assert.equal(lastmodFor(`${SITE}/guides/visa-types/`, map), '2026-06-09');
});

test('lastmodFor tolerates a missing trailing slash', () => {
  const map = new Map([['/apps/didi/', '2026-06-09']]);
  assert.equal(lastmodFor(`${SITE}/apps/didi`, map), '2026-06-09');
});

test('lastmodFor returns undefined for non-content pages', () => {
  const map = new Map([['/guides/visa-types/', '2026-06-09']]);
  assert.equal(lastmodFor(`${SITE}/`, map), undefined);
  assert.equal(lastmodFor(`${SITE}/checklist/`, map), undefined);
  assert.equal(lastmodFor(`${SITE}/guides/`, map), undefined);
  assert.equal(lastmodFor(`${SITE}/search/`, map), undefined);
});

test('lastmodFor returns undefined for unparseable input', () => {
  const map = new Map([['/guides/visa-types/', '2026-06-09']]);
  assert.equal(lastmodFor('not a url', map), undefined);
  assert.equal(lastmodFor(null, map), undefined);
  assert.equal(lastmodFor(undefined, map), undefined);
});

// ---- git commit date is the lastmod source ---------------------------------
// sitemaps.org defines <lastmod> as the file's last modification date. This site
// used `last_verified || date` for it, which are FACT-CHECKING dates governed by a
// deliberate rule ("do not bump unless something was re-verified"). The two
// semantics were conflated, so four content PRs in August 2026 shipped under a
// sitemap that still advertised 2026-07-20 as the newest change on the whole site.
// The frontmatter dates keep their meaning; they are now only a fallback for
// builds with no git history at all.

test('the git commit date wins over last_verified and date', () => {
  const map = buildLastmodMap([
    {
      collection: 'guides',
      slug: 'sim-card',
      gitDate: '2026-08-21T09:10:00Z',
      data: { date: '2026-07-01', last_verified: '2026-07-01' },
    },
  ]);
  assert.equal(map.get('/guides/sim-card/'), '2026-08-21');
});

test('frontmatter dates still stand in when no git date is available', () => {
  const map = buildLastmodMap([
    { collection: 'guides', slug: 'a', gitDate: undefined, data: { last_verified: '2026-06-01', date: '2026-01-01' } },
    { collection: 'apps', slug: 'b', gitDate: null, data: { date: '2026-01-01' } },
    { collection: 'guides', slug: 'c', gitDate: 'not-a-date', data: { last_verified: '2026-05-05' } },
  ]);
  assert.equal(map.get('/guides/a/'), '2026-06-01');
  assert.equal(map.get('/apps/b/'), '2026-01-01');
  assert.equal(map.get('/guides/c/'), '2026-05-05', 'an unparseable git date must not shadow the fallback');
});

test('Spanish guides map to their /es/ route', () => {
  const map = buildLastmodMap([
    { collection: 'guidesEs', slug: 'vpn-or-esim', gitDate: '2026-08-19T00:00:00Z', data: {} },
  ]);
  assert.equal(map.get('/es/guides/vpn-or-esim/'), '2026-08-19');
  assert.equal(map.has('/guides/vpn-or-esim/'), false, 'a translation must not claim the English route');
});

test('lastmodFor resolves Spanish routes', () => {
  const map = new Map([['/es/guides/visa-types/', '2026-07-16']]);
  assert.equal(lastmodFor(`${SITE}/es/guides/visa-types/`, map), '2026-07-16');
  assert.equal(lastmodFor(`${SITE}/es/guides/visa-types`, map), '2026-07-16');
  assert.equal(lastmodFor(`${SITE}/es/`, map), undefined, '/es/ is a listing page');
});

// ---- shipped sitemap -------------------------------------------------------
// The unit tests above all pass even if astro.config.mjs never calls any of this,
// or calls it with the git dates missing. These read the built sitemap and the
// workflows, which is where the original defect actually lived: every unit test
// was green while the shipped file advertised 2026-07-20 as the newest change.

const ROOT = join(here, '..');

// Build into an isolated dist, the same way favicon/social-meta/custom-404 do, so
// these assertions never read a stale artifact.
//
// The previous version reused the repo's `dist/` and skipped the build whenever
// `dist/sitemap-0.xml` already existed. That made the result depend on how old
// `dist/` happened to be, because `node --test` runs BEFORE `npm test`'s own
// `astro build` step. In CI the checkout is fresh, `dist/` is absent, the build
// always ran and the check was sound — which is why CI never surfaced this. Locally
// it failed both ways: a stale `dist/` from another branch reported a lastmod
// mismatch on a perfectly correct tree (observed on main, 2026-09-17), and the
// reverse pairing — edited-but-uncommitted content whose stale lastmod still matches
// its stale commit date — would pass while proving nothing.
let DIST;

before(() => {
  DIST = mkdtempSync(join(tmpdir(), 'sitemap-dist-'));
  execFileSync('npx', ['astro', 'build', '--outDir', DIST], { cwd: ROOT, stdio: 'ignore' });
}, { timeout: 180_000 });

/** [{ loc, lastmod }] from the built sitemap. */
function sitemapEntries() {
  const xml = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
  return [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]*)<\/lastmod>)?/g)].map(
    ([, loc, lastmod]) => ({ loc, lastmod }),
  );
}

/** Every content markdown file, as { route, file }. */
function contentFiles() {
  const out = [];
  for (const [dir, route] of [
    ['src/content/guides', (s) => `/guides/${s}/`],
    ['src/content/apps', (s) => `/apps/${s}/`],
    ['src/content/guides/es', (s) => `/es/guides/${s}/`],
  ]) {
    for (const file of readdirSync(join(ROOT, dir))) {
      if (!file.endsWith('.md')) continue;
      out.push({ route: route(file.replace(/\.md$/, '')), file: `${dir}/${file}` });
    }
  }
  return out;
}

test('every content page ships a lastmod equal to its file\'s last commit date', () => {
  const shipped = new Map(sitemapEntries().map((e) => [new URL(e.loc).pathname, e.lastmod]));
  const dates = contentCommitDates(
    ['src/content/guides', 'src/content/apps'],
    { cwd: ROOT },
  );
  const wrong = [];
  for (const { route, file } of contentFiles()) {
    // A page can be absent from the sitemap legitimately (unaudited translations
    // never render), but if it is there it must carry the right date.
    if (!shipped.has(route)) continue;
    const expected = dates.get(file)?.slice(0, 10);
    const actual = shipped.get(route)?.slice(0, 10);
    if (expected && actual !== expected) wrong.push(`${route} says ${actual}, file last changed ${expected}`);
  }
  assert.deepEqual(wrong, [], `sitemap lastmod must track the content file:\n${wrong.join('\n')}`);
});

test('no content page ships without a lastmod', () => {
  const shipped = new Map(sitemapEntries().map((e) => [new URL(e.loc).pathname, e.lastmod]));
  const missing = contentFiles()
    .filter(({ route }) => shipped.has(route) && !shipped.get(route))
    .map(({ route }) => route);
  // The Spanish routes were the ones this missed: they are content pages, but the
  // lastmod lookup only knew the `guides` and `apps` collections.
  assert.deepEqual(missing, [], `content pages without lastmod: ${missing.join(', ')}`);
});

test('listing and non-content pages still carry no lastmod', () => {
  const shipped = new Map(sitemapEntries().map((e) => [new URL(e.loc).pathname, e.lastmod]));
  for (const route of ['/', '/guides/', '/apps/', '/checklist/', '/about/', '/es/']) {
    assert.ok(shipped.has(route), `${route} must be in the sitemap`);
    assert.equal(shipped.get(route), undefined, `${route} has no reliable date and must not claim one`);
  }
});

test('the workflows that build the site check out full git history', () => {
  // Without `fetch-depth: 0` every content file resolves to the tip commit, i.e.
  // a wrong-but-plausible date on all 41 pages. src/lib/git-dates.mjs throws in
  // that case, so losing this turns into a red build rather than a silent lie —
  // this test is what says why, and catches it one step earlier.
  const checked = [];
  for (const file of ['deploy.yml', 'ci.yml']) {
    const yml = readFileSync(join(ROOT, '.github/workflows', file), 'utf8');
    const jobs = yml.slice(yml.search(/^jobs:$/m));
    // Job blocks start at a 2-space-indented key; slice the file into them so a
    // `npm test` mentioned in a header comment cannot be read as the build job.
    const bounds = [...jobs.matchAll(/^ {2}[\w-]+:$/gm)].map((m) => m.index);
    for (const [i, start] of bounds.entries()) {
      const block = jobs.slice(start, bounds[i + 1] ?? jobs.length);
      if (!/run:\s*npm test\b/.test(block)) continue;
      checked.push(`${file}:${block.slice(0, block.indexOf(':'))}`);
      assert.match(
        block,
        /actions\/checkout@v4\s*\n\s*with:(?:\n\s*#[^\n]*)*\n\s*fetch-depth:\s*0/,
        `${file}: the job running \`npm test\` must checkout with fetch-depth: 0`,
      );
    }
  }
  assert.equal(checked.length, 2, `expected to find both build jobs, found ${checked.join(', ')}`);
});
