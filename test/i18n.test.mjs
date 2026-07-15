import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_LOCALE,
  LOCALES,
  OG_LOCALE,
  localeOf,
  alternatesFor,
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
  // hreflang mechanism at all, so their head is untouched.
  assert.equal(alternatesFor('/guides/visa-types/'), null);
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
