import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildWebsiteSchema, buildOrganizationSchema } from '../src/lib/home-schema.mjs';

const DESCRIPTION =
  'Practical travel guides for foreigners visiting China — visa, mobile payment, apps, transportation, food, and safety.';
const LOGO = 'https://chinaguide.ai/og-default.png';

test('WebSite schema carries brand identity, @id, and language', () => {
  const schema = buildWebsiteSchema(DESCRIPTION);
  assert.equal(schema['@context'], 'https://schema.org');
  assert.equal(schema['@type'], 'WebSite');
  assert.equal(schema['@id'], 'https://chinaguide.ai/#website');
  assert.equal(schema.name, 'ChinaGuide.ai');
  // Google Site Names reads alternateName — direct lever for the brand
  // queries this issue targets ("chinaguide", "china guide").
  assert.deepEqual(schema.alternateName, ['ChinaGuide', 'China Guide']);
  assert.equal(schema.url, 'https://chinaguide.ai/');
  assert.equal(schema.description, DESCRIPTION);
  assert.equal(schema.inLanguage, 'en');
});

test('WebSite links to the Organization entity by @id (entity graph, not duplication)', () => {
  const schema = buildWebsiteSchema(DESCRIPTION);
  assert.deepEqual(schema.publisher, { '@id': 'https://chinaguide.ai/#organization' });
});

test('SearchAction targets /search/?q= with the Google-required query-input contract', () => {
  const action = buildWebsiteSchema(DESCRIPTION).potentialAction;
  assert.equal(action['@type'], 'SearchAction');
  assert.deepEqual(action.target, {
    '@type': 'EntryPoint',
    urlTemplate: 'https://chinaguide.ai/search/?q={search_term_string}',
  });
  // Placeholder name must match query-input, or Sitelinks Searchbox is rejected.
  assert.equal(action['query-input'], 'required name=search_term_string');
});

test('Organization schema matches the site-wide entity from GuideLayout (@id, name, url, logo)', () => {
  const schema = buildOrganizationSchema(LOGO);
  assert.equal(schema['@context'], 'https://schema.org');
  assert.equal(schema['@type'], 'Organization');
  // Must equal GuideLayout's @id exactly so all pages reference one entity.
  assert.equal(schema['@id'], 'https://chinaguide.ai/#organization');
  assert.equal(schema.name, 'ChinaGuide.ai');
  assert.equal(schema.url, 'https://chinaguide.ai');
  assert.deepEqual(schema.logo, { '@type': 'ImageObject', url: LOGO });
});

test('Organization sameAs is an empty array until social profiles exist (#9)', () => {
  const schema = buildOrganizationSchema(LOGO);
  assert.deepEqual(schema.sameAs, []);
});

test('Organization exposes a support contactPoint without changing url (#38)', () => {
  const schema = buildOrganizationSchema(LOGO);
  assert.deepEqual(schema.contactPoint, {
    '@type': 'ContactPoint',
    email: 'support@chinaguide.ai',
    contactType: 'customer support',
  });
  // contactPoint is additive — the canonical entity url must stay untouched.
  assert.equal(schema.url, 'https://chinaguide.ai');
});

test('schemas serialize without undefined fields (set:html + JSON.stringify safe)', () => {
  for (const schema of [buildWebsiteSchema(DESCRIPTION), buildOrganizationSchema(LOGO)]) {
    const json = JSON.stringify(schema);
    assert.ok(!json.includes('undefined'));
    assert.deepEqual(JSON.parse(json), schema);
  }
});
