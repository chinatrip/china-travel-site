// Machine-readable "fact layer" for AI agents (schema v1).
//
// The site already publishes human HTML, per-page markdown, llms.txt and JSON-LD.
// What agents still lack is a small, stable, structured representation they can
// call and cite: one page model per content page, with FAQ claims promoted to
// addressable facts that carry their sources, verification date and confidence.
//
// This module is deliberately dependency-free and pure so `node --test` covers it
// without an Astro build; the Astro endpoints in src/pages/ are thin wrappers.
//
// Design rules:
// - Fact ids are stable (`<slug>.faq.<n>`) and do not depend on wording.
// - Nothing is invented: facts come from authored FAQ entries, and every fact
//   carries the page's `verified_against` sources + `last_verified` date.
// - Confidence is a claim about verification, not about truth: it mirrors the
//   page's review status, which is the same gate the visible site uses.

import { createHash } from 'node:crypto';

export const SITE = 'https://chinaguide.ai';
export const SCHEMA_VERSION = 1;
export const API_BASE = `${SITE}/api/v1`;

/** Volatility -> staleness window in days. Mirrors the wiki's STALE_DAYS. */
export const STALE_DAYS = { high: 90, medium: 180, low: 365 };
const DEFAULT_VOLATILITY = 'medium';

/** Normalize a frontmatter date (string, Date, or junk) to YYYY-MM-DD | null. */
export function normalizeDate(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10);
  }
  if (typeof value !== 'string' || value.trim() === '') return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

/** verified_at + volatility window -> YYYY-MM-DD | null. */
export function staleAfter(verifiedAt, volatility) {
  if (!verifiedAt) return null;
  const days = STALE_DAYS[volatility] ?? STALE_DAYS[DEFAULT_VOLATILITY];
  const date = new Date(`${verifiedAt}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Collection -> public route base. */
function routeBase(collection) {
  if (collection === 'apps') return 'apps';
  if (collection === 'guidesEs') return 'es/guides';
  return 'guides';
}

export function pageUrl(collection, slug) {
  return `${SITE}/${routeBase(collection)}/${slug}/`;
}

export function pageJsonUrl(collection, slug) {
  return `${SITE}/${routeBase(collection)}/${slug}.json`;
}

/** Markdown parity exists only for English guides/apps (see /guides/<slug>.md). */
export function pageMarkdownUrl(collection, slug) {
  if (collection === 'guides' || collection === 'apps') {
    return `${SITE}/${collection}/${slug}.md`;
  }
  return null;
}

/** Review status is the confidence source; the visible site gates on `audited`. */
export function confidenceOf(data) {
  const status = data?.review?.status || data?.status || 'draft';
  if (status === 'audited') return 'audited';
  if (status === 'verified') return 'verified';
  return 'draft';
}

/** Description when present, else the first prose paragraph, flattened to one line. */
export function buildTldr(data, body) {
  if (typeof data?.description === 'string' && data.description.trim()) {
    return data.description.trim().replace(/\s+/g, ' ');
  }
  const lines = String(body ?? '')
    .replace(/```[\s\S]*?```/g, '')
    .split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('|') || trimmed.startsWith('>')) {
      continue;
    }
    return trimmed.replace(/\s+/g, ' ');
  }
  return '';
}

/** H2/H3 headings, in document order (navigation aid; anchors are render-time). */
export function extractSections(body) {
  const sections = [];
  for (const line of String(body ?? '').split('\n')) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (match) sections.push({ level: match[1].length, heading: match[2].trim() });
  }
  return sections;
}

/** Stable content hash over the authored body + the fields a reader sees. */
export function contentHash(data, body) {
  const canonical = JSON.stringify({
    title: data?.title ?? null,
    last_verified: normalizeDate(data?.last_verified),
    body: String(body ?? '').trim(),
  });
  return `sha256:${createHash('sha256').update(canonical).digest('hex')}`;
}

/**
 * Promote authored FAQs to addressable facts.
 * @param {{id: string, data: object}} entry
 * @param {string} collection
 */
export function buildFacts(entry, collection) {
  const data = entry.data ?? {};
  const verifiedAt = normalizeDate(data.last_verified) ?? normalizeDate(data.date);
  const volatility = data.volatility || DEFAULT_VOLATILITY;
  const confidence = confidenceOf(data);
  const sources = Array.isArray(data.verified_against) ? data.verified_against : [];
  const faqs = Array.isArray(data.faqs) ? data.faqs : [];
  return faqs
    .filter((faq) => faq && typeof faq.q === 'string' && typeof faq.a === 'string')
    .map((faq, index) => ({
      id: `${entry.id}.faq.${index + 1}`,
      type: 'faq',
      question: faq.q,
      claim: faq.a,
      applies_to: data.title ?? null,
      sources,
      verified_at: verifiedAt,
      stale_after: staleAfter(verifiedAt, volatility),
      confidence,
      volatility,
      page_json_url: pageJsonUrl(collection, entry.id),
    }));
}

/** Full page model served at /guides/<slug>.json (and /apps/...). */
export function buildPageModel(entry, collection) {
  const data = entry.data ?? {};
  const body = entry.body ?? '';
  const verifiedAt = normalizeDate(data.last_verified) ?? normalizeDate(data.date);
  const volatility = data.volatility || DEFAULT_VOLATILITY;
  const facts = buildFacts(entry, collection);
  return {
    schema_version: SCHEMA_VERSION,
    site: SITE,
    collection,
    slug: entry.id,
    lang: collection === 'guidesEs' ? 'es' : 'en',
    title: data.title ?? null,
    tldr: buildTldr(data, body),
    description: data.description ?? null,
    url: pageUrl(collection, entry.id),
    json_url: pageJsonUrl(collection, entry.id),
    markdown_url: pageMarkdownUrl(collection, entry.id),
    status: data.status || 'audited',
    review: {
      status: data.review?.status ?? null,
      page_audit: normalizeDate(data.review?.page_audit),
      citation_check: normalizeDate(data.review?.citation_check),
    },
    volatility,
    last_verified: verifiedAt,
    updated_at: verifiedAt,
    stale_after: staleAfter(verifiedAt, volatility),
    sources: Array.isArray(data.verified_against) ? data.verified_against : [],
    related: Array.isArray(data.related) ? data.related : [],
    faq_count: facts.length,
    fact_count: facts.length,
    facts,
    sections: extractSections(body),
    content_hash: contentHash(data, body),
  };
}

/** Compact discovery index at /api/v1/pages.json. */
export function buildPagesIndex(models, { generatedAt } = {}) {
  const pages = models
    .map((model) => ({
      slug: model.slug,
      collection: model.collection,
      lang: model.lang,
      title: model.title,
      tldr: model.tldr,
      url: model.url,
      json_url: model.json_url,
      markdown_url: model.markdown_url,
      last_verified: model.last_verified,
      stale_after: model.stale_after,
      volatility: model.volatility,
      status: model.status,
      confidence: confidenceOf(model),
      fact_count: model.fact_count,
      content_hash: model.content_hash,
    }))
    .sort((a, b) => a.url.localeCompare(b.url));
  return {
    schema_version: SCHEMA_VERSION,
    site: SITE,
    generated_at: generatedAt ?? new Date().toISOString(),
    license: 'CC BY-NC 4.0',
    count: pages.length,
    pages,
  };
}

/** Single-fact response for /api/v1/facts/<id>.json. */
export function buildFactDetail(model, factId) {
  const fact = model.facts.find((candidate) => candidate.id === factId);
  if (!fact) return null;
  return {
    schema_version: SCHEMA_VERSION,
    site: SITE,
    fact,
    page: {
      slug: model.slug,
      collection: model.collection,
      title: model.title,
      url: model.url,
      json_url: model.json_url,
      markdown_url: model.markdown_url,
      last_verified: model.last_verified,
      stale_after: model.stale_after,
      confidence: confidenceOf(model),
    },
  };
}
