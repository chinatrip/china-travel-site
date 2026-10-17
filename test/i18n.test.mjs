import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_LOCALE,
  LOCALES,
  OG_LOCALE,
  TRANSLATIONS,
  localeOf,
  alternatesFor,
  t,
  isTranslationStale,
} from '../src/lib/i18n.mjs';

// Unit coverage for the i18n registry helpers that drive locale detection and
// reciprocal hreflang. The routing contract these lock in:
//   - English is the default locale and lives at the site root (NO /en/ prefix),
//     so existing URLs and their indexing stay untouched.
//   - Only pages listed in the TRANSLATIONS registry emit hreflang alternates;
//     every English-only page returns null → its <head> is left byte-identical.

test('English is the default locale served from the root', () => {
  assert.equal(DEFAULT_LOCALE, 'en');
  assert.ok(LOCALES.includes('en'));
  assert.ok(LOCALES.includes('es'));
});

test('localeOf infers locale from the path prefix', () => {
  assert.equal(localeOf('/'), 'en');
  assert.equal(localeOf('/guides/visa-types/'), 'en');
  assert.equal(localeOf('/apps/alipay/'), 'en');
  assert.equal(localeOf('/es/'), 'es');
  assert.equal(localeOf('/es/guides/mobile-payment/'), 'es');
});

test('localeOf never mistakes an English slug that merely starts with "es" for Spanish', () => {
  // Guard against a naive startsWith('/es') check — these are English pages.
  assert.equal(localeOf('/guides/esim/'), 'en');
  assert.equal(localeOf('/apps/essential/'), 'en');
});

test('alternatesFor returns null for untranslated English-only pages', () => {
  // The whole no-regression guarantee: pages with no translation get no
  // hreflang mechanism at all, so their head is untouched. (accommodation is
  // not part of the Spanish pilot set.)
  assert.equal(alternatesFor('/guides/accommodation/'), null);
  assert.equal(alternatesFor('/apps/alipay/'), null);
});

test('alternatesFor emits a reciprocal set for a translated page', () => {
  const alts = alternatesFor('/');
  assert.ok(Array.isArray(alts));
  const byLang = Object.fromEntries(alts.map((a) => [a.hreflang, a.path]));
  assert.equal(byLang.en, '/');
  assert.equal(byLang.es, '/es/');
  // x-default must point at the default-locale (English) URL.
  assert.equal(byLang['x-default'], '/');
});

test('alternatesFor maps a translated guide to its /es/ counterpart both ways', () => {
  const en = alternatesFor('/guides/visa-types/');
  const es = alternatesFor('/es/guides/visa-types/');
  const expected = { en: '/guides/visa-types/', es: '/es/guides/visa-types/', 'x-default': '/guides/visa-types/' };
  assert.deepEqual(Object.fromEntries(en.map((a) => [a.hreflang, a.path])), expected);
  assert.deepEqual(Object.fromEntries(es.map((a) => [a.hreflang, a.path])), expected);
});

test('t returns localized UI strings and falls back to English for gaps', () => {
  assert.equal(t('en', 'faqHeading'), 'Frequently Asked Questions');
  assert.equal(t('es', 'faqHeading'), 'Preguntas frecuentes');
  assert.equal(t('es', 'home'), 'Inicio');
  // Unknown locale → English fallback; unknown key → the raw key.
  assert.equal(t('fr', 'faqHeading'), 'Frequently Asked Questions');
  assert.equal(t('es', 'nope'), 'nope');
});

test('isTranslationStale flags a source re-verified after the translation', () => {
  assert.equal(isTranslationStale('2026-07-01', '2026-07-05'), true);  // source newer → stale
  assert.equal(isTranslationStale('2026-07-01', '2026-07-01'), false); // in sync
  assert.equal(isTranslationStale('2026-07-10', '2026-07-01'), false); // translation ahead
  assert.equal(isTranslationStale(undefined, '2026-07-01'), true);     // missing translation date → attention
  assert.equal(isTranslationStale('2026-07-01', undefined), false);    // no source date to compare
});

test('alternatesFor is symmetric — the /es/ side resolves to the same group', () => {
  const en = alternatesFor('/');
  const es = alternatesFor('/es/');
  assert.deepEqual(
    Object.fromEntries(es.map((a) => [a.hreflang, a.path])),
    Object.fromEntries(en.map((a) => [a.hreflang, a.path])),
  );
});

test('alternatesFor normalizes a missing trailing slash before lookup', () => {
  assert.deepEqual(alternatesFor('/es'), alternatesFor('/es/'));
});

test('OG_LOCALE maps every locale to a region form', () => {
  assert.equal(OG_LOCALE.en, 'en_US');
  assert.equal(OG_LOCALE.es, 'es_ES');
});

test('every published ES guide is registered in TRANSLATIONS (reciprocal hreflang)', () => {
  // Three translated pages shipped without a registry entry and emitted a
  // self-referential hreflang instead of an English alternate. The content dir
  // is the source of truth; the registry must keep up with it.
  const esDir = fileURLToPath(new URL('../src/content/guides/es', import.meta.url));
  const slugs = readdirSync(esDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
  const registered = new Set(TRANSLATIONS.map((entry) => entry.es));
  const missing = slugs.filter((slug) => !registered.has(`/es/guides/${slug}/`));
  assert.deepEqual(
    missing,
    [],
    `ES pages without a TRANSLATIONS entry (no reciprocal hreflang): ${missing.join(', ')}`,
  );
});
