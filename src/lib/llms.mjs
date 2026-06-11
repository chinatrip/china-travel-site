// Pure builders for /llms.txt and /llms-full.txt (spec: https://llmstxt.org/).
// Framework-free so `node --test` covers them without an Astro build; the
// Astro endpoints in src/pages/ are thin wrappers around these functions.

import { resolveWikilinksText } from '../plugins/remark-wikilinks.mjs';

export const SITE = 'https://chinaguide.ai';

// Page delimiter for llms-full.txt. Deliberately NOT `---`: page bodies contain
// markdown horizontal rules, so a `---` delimiter would shred pages for any
// consumer that splits on it.
export const PAGE_SEPARATOR = '===== PAGE =====';

// Content license advertised to AI consumers: CC BY-NC 4.0 — reuse with
// attribution is allowed, commercial republication is not.
export const LICENSE_URL = 'https://creativecommons.org/licenses/by-nc/4.0/';

// Static (non-collection) routes. Content pages (guides/apps) are pulled from
// getCollection at build time, so new wiki pages are picked up automatically —
// only add here when a new *static* route ships.
// /search/ is intentionally excluded: it is a client-side Pagefind shell with
// no indexable content of its own (noindex + filtered out of the sitemap).
export const SITE_PAGES = [
  {
    title: 'Home',
    url: `${SITE}/`,
    description: 'Overview of all source-verified China travel guides and essential apps.',
  },
  {
    title: 'All Guides',
    url: `${SITE}/guides/`,
    description:
      'Index of every travel guide — visas, payments, connectivity, transport, safety, and more.',
  },
  {
    title: 'Essential Apps',
    url: `${SITE}/apps/`,
    description:
      'Index of must-have Chinese apps for travelers (WeChat, Alipay, DiDi, …) with setup walkthroughs.',
  },
  {
    title: 'China Readiness Checklist',
    url: `${SITE}/checklist/`,
    description:
      'Interactive pre-trip checklist personalized by nationality, travel dates, and destinations.',
  },
  {
    title: 'About',
    url: `${SITE}/about/`,
    description:
      'Who runs ChinaGuide.ai and how guides are source-checked — against official documentation wherever it exists — before publication.',
  },
  {
    title: 'Editorial Policy',
    url: `${SITE}/editorial-policy/`,
    description:
      'Sourcing standards, update principles, the corrections process, and how AI assistance is used and reviewed.',
  },
];

const HEADER_TITLE = '# ChinaGuide.ai';
const HEADER_BLOCKQUOTE =
  '> Practical, source-verified travel guides for foreign visitors to China. Every page is checked against sources — official documentation (gov.cn, NIA, embassy notices) wherever it exists — and shows a "Last verified" date. Coverage includes visas, mobile payments, connectivity (VPN vs eSIM), transport, accommodation, safety, food, and the essential Chinese apps.';

const byTitle = (a, b) => a.data.title.localeCompare(b.data.title);

/** Normalize a last_verified value (string or YAML-parsed Date) to YYYY-MM-DD, or null. */
function verifiedDate(e) {
  if (!e.data.last_verified) return null;
  const d = new Date(e.data.last_verified);
  return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
}

/** One llms.txt list entry for a content-collection page. */
export function entryLine(base, e) {
  const desc = e.data.description ? `: ${e.data.description}` : '';
  const date = verifiedDate(e);
  const verified = date ? ` (Verified ${date})` : '';
  return `- [${e.data.title}](${SITE}/${base}/${e.id}/)${desc}${verified}`;
}

const sitePageLine = (p) => `- [${p.title}](${p.url}): ${p.description}`;

/** Remove a leading YAML frontmatter block, if present. */
export function stripFrontmatter(raw) {
  const m = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(raw);
  return (m ? raw.slice(m[0].length) : raw).trim();
}

/** Build the /llms.txt index. */
export function buildLlmsTxt({ guides, apps }) {
  const g = [...guides].sort(byTitle);
  const a = [...apps].sort(byTitle);
  return `${HEADER_TITLE}

${HEADER_BLOCKQUOTE}

License: ${LICENSE_URL}
Full text of every page in a single file: ${SITE}/llms-full.txt

## Site
${SITE_PAGES.map(sitePageLine).join('\n')}

## Guides
${g.map((e) => entryLine('guides', e)).join('\n')}

## Apps
${a.map((e) => entryLine('apps', e)).join('\n')}

## About
ChinaGuide.ai helps foreign travelers get China-ready and get things done in China. Content is written to be answer-first, source-cited, and dated, for both AI engines and human readers.
`;
}

/** Drop a leading H1 — the section header already carries the title (mirrors remark-strip-leading-h1). */
function stripLeadingH1(md) {
  return md.replace(/^#[ \t][^\n]*\r?\n+/, '').trim();
}

/**
 * Prepare a raw markdown body for the AI-facing text feed:
 * frontmatter out; wiki workflow comments out (e.g. "<!-- Unverified: … -->" —
 * invisible in rendered HTML but corrosive to citation trust in plain text);
 * leading H1 deduped; [[wiki/…]] links resolved to the same absolute URLs the
 * rendered site links to, with unpublished targets degraded to plain text.
 */
function cleanBody(raw, isPublished) {
  let md = stripFrontmatter(raw ?? '');
  // Comments first, so a comment ahead of the title doesn't shield the H1 strip.
  md = md.replace(/<!--[\s\S]*?-->/g, '').trim();
  md = stripLeadingH1(md);
  md = resolveWikilinksText(md, { siteBase: SITE, isPublished });
  return md.replace(/\n{3,}/g, '\n\n').trim();
}

function fullPageSection(base, e, isPublished) {
  const date = verifiedDate(e);
  const verified = date ? `\nLast verified: ${date}` : '';
  return `# ${e.data.title}
URL: ${SITE}/${base}/${e.id}/${verified}

${cleanBody(e.body, isPublished)}`;
}

/** Build /llms-full.txt: every content page's full markdown body in one file. */
export function buildLlmsFullTxt({ guides, apps }) {
  const g = [...guides].sort(byTitle);
  const a = [...apps].sort(byTitle);
  // Wikilink targets resolve to a real URL only when the target entry is in
  // this build (callers pre-filter collections to status === 'audited').
  const published = {
    concepts: new Set(g.map((e) => e.id)),
    entities: new Set(a.map((e) => e.id)),
  };
  const isPublished = (section, slug) => published[section]?.has(slug) ?? false;
  const pages = [
    ...g.map((e) => fullPageSection('guides', e, isPublished)),
    ...a.map((e) => fullPageSection('apps', e, isPublished)),
  ];
  return `${HEADER_TITLE} — Full Content

${HEADER_BLOCKQUOTE}

License: ${LICENSE_URL}
Index version: ${SITE}/llms.txt
Each content page below begins with "# <page title>" and its canonical "URL:" line.

${pages.map((p) => `${PAGE_SEPARATOR}\n\n${p}`).join('\n\n')}
`;
}
