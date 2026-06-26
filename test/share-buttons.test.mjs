import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Build-output assertions for the page share component (ShareButtons.astro wired
// into GuideLayout). These render a real guide page through the layout so the
// test reflects the actual HTML shipped to users and crawlers — both the inline
// header-meta placement and the end-of-article card, the full UTM scheme baked
// into every share link, accessibility of icon-only controls, and the HARD SEO
// guarantee that the page's own canonical stays query-free.
//
// Like listing-pages-seo.test.mjs, this builds on demand when run standalone so
// the dist/ it reads is fresh; in the `npm test` chain astro build has already run.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const dist = (p) => fileURLToPath(new URL(`../dist/${p}`, import.meta.url));

// Representative guide page: an app page rendered via GuideLayout. Slug is the
// last path segment of /apps/alipay/ → "alipay" (the utm_campaign value).
const PAGE = 'apps/alipay/index.html';
const SLUG = 'alipay';
const CANONICAL = 'https://chinaguide.ai/apps/alipay/';

function ensureBuilt() {
  if (existsSync(dist(PAGE))) return;
  execFileSync('npx', ['astro', 'build'], { cwd: ROOT, stdio: 'ignore' });
}

before(() => ensureBuilt(), { timeout: 180_000 });

function loadPage() {
  assert.ok(existsSync(dist(PAGE)), `expected built guide page ${PAGE}`);
  return readFileSync(dist(PAGE), 'utf8');
}

/** The <head> of the page (for canonical assertions). */
function headOf(html) {
  return html.slice(0, html.indexOf('</head>'));
}

/** Collect every href/value that looks like a built share URL/intent in the page. */
function shareTargets(html) {
  // hrefs of the four target links + any data-share-url attribute (copy/native).
  const out = [];
  for (const m of html.matchAll(/(?:href|data-share-url)="([^"]*)"/g)) {
    out.push(m[1]);
  }
  return out;
}

/**
 * Decode the canonical page URL (with its utm params) out of a single share
 * intent/href, regardless of channel. Returns the URLSearchParams of the
 * embedded share URL, or null if this href carries no share URL.
 *
 * Channels embed the page share URL differently:
 *   wa.me/?text=<title + " " + shareUrl>   (whatsapp)
 *   reddit.com/submit?url=<shareUrl>&...    (reddit)
 *   twitter.com/intent/tweet?url=<shareUrl> (x)
 *   mailto:?subject=...&body=<shareUrl>     (email)
 *   data-share-url="<shareUrl>"             (copy / native share)
 */
function utmParamsFor(href) {
  // Attribute values HTML-escape '&' as '&amp;'; undo that, then URL-decode so
  // both the encoded intent hrefs and the raw data-share-url attrs normalise to
  // the same plain page URL form.
  const decoded = decodeURIComponent(href.replace(/&amp;/g, '&'));
  // Find the embedded chinaguide.ai page URL carrying utm params.
  const m = decoded.match(/https:\/\/chinaguide\.ai\/[^\s"<>]*\?[^\s"<>]*utm_[^\s"<>]*/);
  if (!m) return null;
  try {
    return new URL(m[0]).searchParams;
  } catch {
    return null;
  }
}

const CHANNELS = [
  { source: 'whatsapp', host: 'wa.me' },
  { source: 'reddit', host: 'reddit.com' },
  { source: 'x', host: 'twitter.com' },
  { source: 'email', host: 'mailto:' },
  { source: 'copy', host: null },
];

// ---- placements -------------------------------------------------------------

test('share affordance is present in BOTH placements (inline header + end-of-article card)', () => {
  const html = loadPage();
  // Both placements are emitted by the same component with variant inline|card.
  // We mark them with stable hooks so the test is robust to copy/markup tweaks.
  assert.match(html, /data-share-variant="inline"/, 'inline (header meta-row) share placement present');
  assert.match(html, /data-share-variant="card"/, 'end-of-article share card present');
  // The card carries the approved heading + subtext.
  assert.match(html, /Found this guide helpful\?/, 'card heading present');
  assert.match(html, /Share it with fellow travelers heading to China\./, 'card subtext present');
});

// ---- all five channels, each with the exact UTM scheme ----------------------

/**
 * Slice out a single placement's block. Each placement's root carries a unique
 * data-share-variant marker and they appear in DOM order (inline before card),
 * so a block runs from its own marker up to the next placement marker (or EOF).
 * This bounds the slice by structure rather than a brittle fixed char count —
 * which matters since the inline block grew (native button sits between the
 * target group and Copy).
 */
function placementBlock(html, variant) {
  const idx = html.indexOf(`data-share-variant="${variant}"`);
  assert.ok(idx >= 0, `${variant} block present`);
  const rest = html.slice(idx + 1);
  const nextIdx = rest.indexOf('data-share-variant="');
  return nextIdx >= 0 ? rest.slice(0, nextIdx) : rest;
}

test('all five channels are present in each placement', () => {
  const html = loadPage();
  for (const variant of ['inline', 'card']) {
    const block = placementBlock(html, variant);
    for (const { host } of CHANNELS) {
      if (host === null) {
        assert.match(block, /data-share-action="copy"/, `${variant}: copy control present`);
      } else if (host === 'mailto:') {
        assert.match(block, /href="mailto:/, `${variant}: email channel present`);
      } else {
        assert.ok(
          block.includes(host),
          `${variant}: ${host} channel link present`,
        );
      }
    }
  }
});

test('every share link carries utm_medium=share, the correct utm_source, and utm_campaign=<slug>', () => {
  const html = loadPage();

  // Map each channel to the utm_source it must stamp.
  const expectedSource = {
    'wa.me': 'whatsapp',
    'reddit.com': 'reddit',
    'twitter.com': 'x',
    'mailto:': 'email',
  };

  const targets = shareTargets(html);

  // Collect, per utm_source, that at least one share URL exists with the full scheme.
  const seenSources = new Set();
  for (const href of targets) {
    const params = utmParamsFor(href);
    if (!params) continue;
    if (params.get('utm_medium') !== 'share') continue;
    const source = params.get('utm_source');
    if (!source) continue;
    assert.equal(params.get('utm_medium'), 'share', `${source}: utm_medium=share`);
    assert.equal(params.get('utm_campaign'), SLUG, `${source}: utm_campaign=${SLUG}`);
    seenSources.add(source);
  }

  for (const source of ['whatsapp', 'reddit', 'x', 'email', 'copy']) {
    assert.ok(
      seenSources.has(source),
      `a share URL with utm_source=${source} (and utm_medium=share, utm_campaign=${SLUG}) must be present`,
    );
  }
});

test('whatsapp/reddit/x target links open in a new tab with rel noopener', () => {
  const html = loadPage();
  for (const host of ['wa.me', 'reddit.com', 'twitter.com']) {
    const re = new RegExp(`<a[^>]*${host.replace('.', '\\.')}[^>]*>`, 'g');
    const tags = [...html.matchAll(re)].map((m) => m[0]);
    assert.ok(tags.length > 0, `${host} link present`);
    for (const tag of tags) {
      assert.match(tag, /target="_blank"/, `${host} link opens in new tab`);
      assert.match(tag, /rel="[^"]*noopener[^"]*"/, `${host} link has rel=noopener`);
    }
  }
});

// ---- responsive: inline placement must not overflow on narrow screens -------
// True horizontal-overflow can't be measured in node, so we assert the fix
// *mechanism* instead: (a) the inline container can wrap, and (b) the
// native-share toggle exists and hides the target-icon group as a distinct,
// toggleable unit (so mobile shows native "Share this guide" + Copy only).

/** Slice out the inline placement's root <div ...> opening tag. */
function inlineRootTag(html) {
  const idx = html.indexOf('data-share-variant="inline"');
  assert.ok(idx >= 0, 'inline placement present');
  const start = html.lastIndexOf('<div', idx);
  const end = html.indexOf('>', idx);
  return html.slice(start, end + 1);
}

test('inline share container can wrap (flex-wrap) so it can never cause horizontal overflow', () => {
  const tag = inlineRootTag(loadPage());
  assert.match(tag, /\bflex-wrap\b/, 'inline container must carry a flex-wrap utility');
});

test('native-share toggle hides the target-icon group as a distinct, toggleable unit', () => {
  const html = loadPage();

  // (1) The target icons live in a dedicated, addressable group.
  assert.match(html, /class="[^"]*\bshare-targets\b[^"]*"/, 'a .share-targets group wraps the channel icons');

  // (2) A distinct native-share button exists (separate element from the group).
  assert.match(html, /class="[^"]*\bshare-native-btn\b[^"]*"/, 'a .share-native-btn element exists');

  // (3) CSS collapses the target group when the root is flagged native-capable.
  //     The rule + the toggle class the script applies must both be present.
  //     Regexes tolerate Astro's scoping ([data-astro-cid-…]) and minification.
  assert.match(
    html,
    /\.share-has-native\s+\.share-targets[^{]*\{\s*display:\s*none/,
    'CSS hides .share-targets when the root has .share-has-native',
  );
  assert.match(
    html,
    /classList\.add\(\s*['"]share-has-native['"]\s*\)/,
    "the inline script adds 'share-has-native' to the root when navigator.share exists",
  );

  // (4) The native button reveal is gated on navigator.share support
  //     (minifier may drop the space: `"share"in navigator`).
  assert.match(html, /['"]share['"]\s*in\s+navigator/, 'native reveal is gated on navigator.share support');

  // (5) Sanity: the group and the native button are different elements, so the
  //     toggle genuinely swaps them rather than hiding both or neither.
  const groupIdx = html.search(/class="[^"]*\bshare-targets\b/);
  const nativeIdx = html.search(/class="[^"]*\bshare-native-btn\b/);
  assert.ok(groupIdx >= 0 && nativeIdx >= 0 && groupIdx !== nativeIdx, 'group and native button are distinct elements');
});

// ---- accessibility ----------------------------------------------------------

test('icon-only share controls expose an aria-label', () => {
  const html = loadPage();
  // The inline placement uses icon-only buttons/links; each must be labelled.
  // Assert the five channel labels appear as aria-label values somewhere.
  for (const label of ['WhatsApp', 'Reddit', 'Email', 'Copy link']) {
    const re = new RegExp(`aria-label="[^"]*${label}[^"]*"`, 'i');
    assert.match(html, re, `aria-label for ${label} present`);
  }
  // X is labelled "Share on X" / "X" — match the bare token at a word boundary.
  assert.match(html, /aria-label="[^"]*\bX\b[^"]*"/, 'aria-label for X present');
});

// ---- no third-party scripts -------------------------------------------------

test('share component introduces no third-party <script src>', () => {
  const html = loadPage();
  for (const m of html.matchAll(/<script[^>]*\bsrc="([^"]*)"[^>]*>/g)) {
    const src = m[1];
    // Only first-party (relative / same-origin) script srcs are allowed.
    const isFirstParty =
      src.startsWith('/') ||
      src.startsWith('./') ||
      src.startsWith('../') ||
      src.startsWith('https://chinaguide.ai/') ||
      !/^https?:\/\//.test(src);
    assert.ok(isFirstParty, `no third-party script src introduced (found ${src})`);
  }
});

// ---- HARD SEO: page's own canonical must stay clean -------------------------

test("the page's own canonical has NO query string (share UTMs must not leak into canonical)", () => {
  const h = headOf(loadPage());
  const tag = h.match(/<link[^>]*rel="canonical"[^>]*>/i);
  assert.ok(tag, 'canonical link present');
  const href = tag[0].match(/\bhref="([^"]*)"/i)?.[1];
  assert.ok(href, 'canonical href present');
  assert.equal(href, CANONICAL, 'canonical is the clean trailing-slash URL');
  assert.ok(!href.includes('?'), `canonical must have no query string (got ${href})`);
});
