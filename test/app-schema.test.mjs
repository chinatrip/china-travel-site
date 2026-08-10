import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { buildSoftwareApplication, APP_SLUGS } from '../src/lib/app-schema.mjs';

// app-schema.mjs attaches a SoftwareApplication entity to each /apps/<slug>/
// Article (as its `about`). These tests pin the contract: every mapped app is a
// well-formed node, unknown slugs opt out, and — critically — no ratings are
// fabricated (we have no first-party rating data and won't invent it).

const here = dirname(fileURLToPath(import.meta.url));
const APPS_DIR = join(here, '..', 'src', 'content', 'apps');

// schema.org's documented ApplicationCategory values we actually use.
const VALID_CATEGORIES = new Set([
  'TravelApplication',
  'FinanceApplication',
  'LifestyleApplication',
  'CommunicationApplication',
]);

test('buildSoftwareApplication returns null for guide / unknown slugs', () => {
  assert.equal(buildSoftwareApplication('mobile-payment'), null);
  assert.equal(buildSoftwareApplication(''), null);
  assert.equal(buildSoftwareApplication(undefined), null);
});

test('every mapped app yields a well-formed SoftwareApplication node', () => {
  assert.ok(APP_SLUGS.length > 0, 'expected at least one mapped app');
  for (const slug of APP_SLUGS) {
    const node = buildSoftwareApplication(slug);
    assert.equal(node['@type'], 'SoftwareApplication', `${slug}: @type`);
    assert.ok(typeof node.name === 'string' && node.name.length > 0, `${slug}: name`);
    assert.ok(
      VALID_CATEGORIES.has(node.applicationCategory),
      `${slug}: applicationCategory "${node.applicationCategory}" must be a documented schema.org value`,
    );
    assert.equal(node.operatingSystem, 'Android, iOS', `${slug}: operatingSystem`);
    assert.equal(node.offers['@type'], 'Offer', `${slug}: offers @type`);
    assert.equal(node.offers.price, 0, `${slug}: free download`);
    assert.equal(node.offers.priceCurrency, 'USD', `${slug}: priceCurrency`);
  }
});

test('SoftwareApplication nodes carry no fabricated ratings or reviews', () => {
  for (const slug of APP_SLUGS) {
    const node = buildSoftwareApplication(slug);
    assert.ok(!('aggregateRating' in node), `${slug}: must not emit aggregateRating`);
    assert.ok(!('review' in node), `${slug}: must not emit review`);
    assert.ok(!('ratingValue' in node), `${slug}: must not emit ratingValue`);
  }
});

const APP_CONTENT_FILES = readdirSync(APPS_DIR).filter((f) => f.endsWith('.md'));

test('every mapped slug points at a real app content file', () => {
  const contentSlugs = new Set(APP_CONTENT_FILES.map((f) => f.replace(/\.md$/, '')));
  for (const slug of APP_SLUGS) {
    assert.ok(contentSlugs.has(slug), `${slug}: mapped in app-schema but no src/content/apps/${slug}.md`);
  }
});

// Reverse direction (guards against silent drift): every app page that will
// actually build must have a mapping, or it ships with no SoftwareApplication
// `about` and nothing catches it. apps/[id].astro builds only status: audited
// pages, and the content schema defaults an omitted status to 'audited', so an
// absent status field still means the page builds.
test('every built (audited) app content file has a SoftwareApplication mapping', () => {
  const mapped = new Set(APP_SLUGS);
  for (const f of APP_CONTENT_FILES) {
    const slug = f.replace(/\.md$/, '');
    const src = readFileSync(join(APPS_DIR, f), 'utf8');
    const m = src.match(/^status:\s*["']?([^"'\n]+?)["']?\s*$/m);
    const status = m ? m[1].trim() : 'audited';
    if (status !== 'audited') continue; // unbuilt drafts don't need a mapping
    assert.ok(
      mapped.has(slug),
      `${slug}: audited app page will build with no SoftwareApplication — add it to APPS in src/lib/app-schema.mjs`,
    );
  }
});
