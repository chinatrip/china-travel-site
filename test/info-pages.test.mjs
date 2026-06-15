import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Source-level guards for the three "info" pages (about / checklist / search).
// These pages render JSON-LD and a11y landmarks straight from .astro source,
// so the built-HTML checkers never see the JS-rendered checklist items or the
// pagefind-injected search input. Guard the load-bearing bits at the source.

const read = (rel) =>
  readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');

const aboutSrc = read('../src/pages/about.astro');
const checklistSrc = read('../src/pages/checklist.astro');
const searchSrc = read('../src/pages/search.astro');

// Pull the `description = '...'` / `description="..."` value a page passes to
// BaseLayout. Handles both the frontmatter const form (about) and the inline
// attribute form (checklist / search).
function metaDescription(src) {
  const constForm = src.match(/const\s+description\s*=\s*\n?\s*(['"`])([\s\S]*?)\1/);
  if (constForm) return constForm[2].replace(/\s+/g, ' ').trim();
  const attrForm = src.match(/description=(['"])([\s\S]*?)\1/);
  return attrForm ? attrForm[2].replace(/\s+/g, ' ').trim() : null;
}

// ---------------------------------------------------------------------------
// meta description: present and within Google's ~160-char snippet budget
// ---------------------------------------------------------------------------
for (const [name, src] of [
  ['about', aboutSrc],
  ['checklist', checklistSrc],
  ['search', searchSrc],
]) {
  test(`${name}: meta description exists and is <= 160 chars`, () => {
    const desc = metaDescription(src);
    assert.ok(desc, `no meta description found in ${name}.astro`);
    assert.ok(desc.length > 0, `empty meta description in ${name}.astro`);
    assert.ok(
      desc.length <= 160,
      `meta description in ${name}.astro is ${desc.length} chars (>160): ${desc}`,
    );
  });
}

// ---------------------------------------------------------------------------
// search: noindex shell, a11y search landmark, no stray schema
// ---------------------------------------------------------------------------
test('search: stays noindex (a query-result shell must not be indexed)', () => {
  assert.match(
    searchSrc,
    /<BaseLayout[^>]*\bnoindex\b/,
    'search.astro must pass noindex to BaseLayout',
  );
});

test('search: wraps the pagefind UI in a named search landmark', () => {
  // pagefind injects an <input> with only a placeholder/title — no aria-label,
  // no <label>, no landmark. Give the region a search landmark with an
  // accessible name so it is reachable and announced. The <search> element has
  // an implicit role="search"; the #search mount point must live inside it.
  const landmark = searchSrc.match(/<search\b[^>]*>([\s\S]*?)<\/search>/);
  assert.ok(landmark, 'search.astro should wrap the search UI in a <search> landmark');
  assert.match(
    landmark[0],
    /aria-label\s*=/,
    'the <search> landmark needs an aria-label (accessible name)',
  );
  assert.match(
    landmark[1],
    /id=("|')search\1/,
    'the pagefind mount (#search) must be inside the <search> landmark',
  );
});

test('search: injects no JSON-LD (a noindex result shell needs no schema)', () => {
  assert.doesNotMatch(
    searchSrc,
    /application\/ld\+json/,
    'search.astro must not inject structured data',
  );
});

// ---------------------------------------------------------------------------
// about: AboutPage schema must inline the FULL Organization node, not a bare
// dangling {"@id": …} mainEntity (Google parses JSON-LD per page).
// ---------------------------------------------------------------------------
test('about: AboutPage schema inlines the full Organization entity', () => {
  assert.match(aboutSrc, /'@type':\s*'AboutPage'/, 'AboutPage @type missing');
  // The Organization node is spread in from buildOrganizationSchema, not a bare
  // {"@id": …} reference. Spreading the builder result is the inline contract.
  assert.match(
    aboutSrc,
    /mainEntity:\s*organizationEntity/,
    'mainEntity must be the inlined Organization entity, not a bare @id ref',
  );
  assert.match(
    aboutSrc,
    /buildOrganizationSchema\(/,
    'about.astro must build the Organization node from the shared builder',
  );
});

// ---------------------------------------------------------------------------
// checklist: schema must MATCH the page. The static, indexable content is a
// curated set of links to real published guide/app pages, so an ItemList of
// those routes is honest. A HowTo would be schema spam (Google deprecated it,
// and the page is not literal sequential steps), so it must NOT be present.
// ---------------------------------------------------------------------------
test('checklist: emits an ItemList (matches the curated link set), not HowTo', () => {
  assert.match(
    checklistSrc,
    /buildItemList\(/,
    'checklist.astro should build an ItemList from its curated routes',
  );
  assert.match(
    checklistSrc,
    /application\/ld\+json/,
    'the ItemList must be emitted as JSON-LD',
  );
  // HowTo is the wrong type here — guard against it being added later.
  assert.doesNotMatch(
    checklistSrc,
    /["']@type["']\s*:\s*["']HowTo["']|@type:\s*['"]HowTo['"]/,
    'checklist.astro must not claim HowTo (schema-content mismatch)',
  );
});

test('checklist: every ItemList route also appears as a real link on the page', () => {
  // Extract the routes fed to buildItemList(...) and require each to be an
  // href the static prose actually renders — so the schema never points at a
  // page the visitor cannot reach from this page.
  const call = checklistSrc.match(/buildItemList\(\s*[^,]+,\s*\[([\s\S]*?)\]\s*\)/);
  assert.ok(call, 'could not find the buildItemList([...]) route array');
  const routes = [...call[1].matchAll(/(['"`])(\/[^'"`]+)\1/g)].map((m) => m[2]);
  assert.ok(routes.length >= 3, `expected several ItemList routes, got ${routes.length}`);

  const hrefs = new Set(
    [...checklistSrc.matchAll(/href=("|')(\/[^"']+)\1/g)].map((m) => m[2]),
  );
  const orphans = routes.filter((r) => !hrefs.has(r));
  assert.deepEqual(
    orphans,
    [],
    `ItemList routes with no matching link on the page: ${orphans.join(', ')}`,
  );
});
