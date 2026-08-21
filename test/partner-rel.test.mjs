import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import rehypePartnerRel, {
  isPartnerUrl,
  withSponsored,
  assertValidDomains,
  PARTNER_DOMAINS,
} from '../src/plugins/rehype-partner-rel.mjs';
import { outboundRel } from '../src/lib/partner-links.mjs';

// Outbound links to commercial partners must carry rel="sponsored" (Google's
// value for compensated / link-exchange placements). The plugin applies it at
// render time; these tests pin the matching rules, the merge behaviour, and —
// against a built dist — that no partner link ever ships unqualified.

const here = dirname(fileURLToPath(import.meta.url));

// The URL-matching rules are the durable part of this module — they outlive any one
// commercial arrangement — so they are exercised against a fixture list rather than
// against whatever PARTNER_DOMAINS currently holds. Pinning them to the live roster
// meant every matching test here went red the moment a partnership ended, which is
// precisely when you least want these guarantees to go dark. nomadesim.com below is
// a test string, not a statement about who we have a deal with.
const FIXTURE = ['nomadesim.com'];

// ---- URL matching ----------------------------------------------------------

test('matches a partner domain and its subdomains', () => {
  assert.equal(isPartnerUrl('https://www.nomadesim.com/china-eSIM', FIXTURE), true);
  assert.equal(isPartnerUrl('https://nomadesim.com/', FIXTURE), true);
  assert.equal(isPartnerUrl('http://help.nomadesim.com/article', FIXTURE), true);
  assert.equal(isPartnerUrl('https://NOMADESIM.COM/x', FIXTURE), true, 'host match is case-insensitive');
});

test('does not match lookalike or unrelated domains', () => {
  assert.equal(isPartnerUrl('https://notnomadesim.com/', FIXTURE), false, 'suffix lookalike must not match');
  assert.equal(isPartnerUrl('https://nomadesim.com.evil.test/', FIXTURE), false, 'domain-in-subdomain must not match');
  assert.equal(isPartnerUrl('https://nomadesim.com@attacker.test/', FIXTURE), false, 'userinfo must not be read as the host');
  assert.equal(isPartnerUrl('https://xn--nmadesim-p1a.com/', FIXTURE), false, 'punycode homograph must not match');
  assert.equal(isPartnerUrl('https://www.airalo.com/china-esim', FIXTURE), false);
  assert.equal(isPartnerUrl('https://esim.holafly.com/esim-china/', FIXTURE), false);
});

// Both of these render as working outbound partner links, so missing them
// would ship an unqualified paid link — the dangerous direction.
test('matches partner links that are protocol-relative or use a trailing-dot FQDN', () => {
  assert.equal(isPartnerUrl('//nomadesim.com/x', FIXTURE), true, 'protocol-relative link resolves to https');
  assert.equal(isPartnerUrl('//www.nomadesim.com/china-eSIM', FIXTURE), true);
  assert.equal(isPartnerUrl('https://nomadesim.com./x', FIXTURE), true, 'trailing root label is the same host');
  assert.equal(isPartnerUrl('https://www.nomadesim.com./x', FIXTURE), true);
});

test('tolerates a configured domain written with stray dots', () => {
  assert.equal(isPartnerUrl('https://example.test/a', ['.example.test.']), true);
  assert.equal(isPartnerUrl('https://example.test/a', ['']), false, 'empty entry must not match everything');
});

test('ignores internal, relative, non-http and malformed URLs', () => {
  for (const url of ['/guides/internet-connectivity/', '#anchor', '', 'not a url', 'mailto:a@nomadesim.com', 'javascript:void(0)']) {
    assert.equal(isPartnerUrl(url), false, `${JSON.stringify(url)} must not match`);
  }
  for (const url of [undefined, null, 42, {}]) {
    assert.equal(isPartnerUrl(url), false, `${JSON.stringify(url)} must not match`);
  }
});

// ---- partner list validation -----------------------------------------------
// The list is where a future partner gets added, and every wrong way of writing
// an entry fails silently in the fail-open direction. It must throw instead.

// An empty roster is a legitimate state — it is what "we currently have no paid or
// exchanged placements" looks like — so this no longer asserts the list is non-empty.
// What must stay true either way is that every entry is a bare host: a scheme, path,
// port or stray whitespace in here silently matches nothing, which fails open.
test('the shipped PARTNER_DOMAINS list is well-formed', () => {
  assert.doesNotThrow(() => assertValidDomains(PARTNER_DOMAINS));
  assert.ok(Array.isArray(PARTNER_DOMAINS));
  for (const entry of PARTNER_DOMAINS) {
    assert.equal(typeof entry, 'string');
    assert.doesNotMatch(entry, /[:/\s]/, `partner domain ${JSON.stringify(entry)} must be a bare host`);
  }
});

test('malformed partner entries throw rather than matching nothing', () => {
  for (const bad of [
    'https://nomadesim.com',     // scheme
    'nomadesim.com/china-eSIM',  // path
    'nomadesim.com:443',         // port
    'nomadesim',                 // no TLD
    'nomädesim.com',             // unicode IDN — must be punycode
    '',
    '   ',
    null,
    42,
  ]) {
    assert.throws(
      () => assertValidDomains([bad]),
      /invalid partner domain|must be an array/,
      `${JSON.stringify(bad)} must be rejected`,
    );
  }
  assert.throws(() => assertValidDomains('nomadesim.com'), TypeError, 'a bare string is not a list');
});

test('the plugin factory validates a custom domain list', () => {
  assert.throws(() => rehypePartnerRel({ domains: ['https://example.test'] }), /invalid partner domain/);
  assert.doesNotThrow(() => rehypePartnerRel({ domains: ['example.test'] }));
});

// ---- rel merging -----------------------------------------------------------

test('withSponsored preserves existing rel values and is idempotent', () => {
  assert.deepEqual(withSponsored(undefined), ['sponsored']);
  assert.deepEqual(withSponsored(''), ['sponsored']);
  assert.deepEqual(withSponsored('noopener'), ['noopener', 'sponsored']);
  assert.deepEqual(withSponsored(['noopener', 'noreferrer']), ['noopener', 'noreferrer', 'sponsored']);
  assert.deepEqual(withSponsored(['sponsored']), ['sponsored'], 'must not duplicate');
  assert.deepEqual(withSponsored('sponsored'), ['sponsored'], 'must not duplicate');
});

// ---- tree transform --------------------------------------------------------

/** Minimal HAST anchor. */
const a = (href, properties = {}) => ({
  type: 'element',
  tagName: 'a',
  properties: { href, ...properties },
  children: [{ type: 'text', value: 'link' }],
});

/** Wrap nodes in a root with one level of nesting, to exercise the walk. */
const tree = (...nodes) => ({
  type: 'root',
  children: [{ type: 'element', tagName: 'p', properties: {}, children: nodes }],
});

test('plugin marks partner anchors and leaves others untouched', () => {
  const partner = a('https://www.nomadesim.com/china-eSIM');
  const other = a('https://www.airalo.com/china-esim');
  const internal = a('/guides/sim-card/');
  rehypePartnerRel({ domains: FIXTURE })(tree(partner, other, internal));

  assert.deepEqual(partner.properties.rel, ['sponsored']);
  assert.equal(other.properties.rel, undefined, 'non-partner link must not be touched');
  assert.equal(internal.properties.rel, undefined, 'internal link must not be touched');
});

test('plugin is idempotent and preserves existing rel', () => {
  const node = a('https://nomadesim.com/x', { rel: ['noopener'] });
  const t = tree(node);
  rehypePartnerRel({ domains: FIXTURE })(t);
  rehypePartnerRel({ domains: FIXTURE })(t);
  assert.deepEqual(node.properties.rel, ['noopener', 'sponsored']);
});

test('plugin accepts a custom domain list', () => {
  const node = a('https://example.test/offer');
  rehypePartnerRel({ domains: ['example.test'] })(tree(node));
  assert.deepEqual(node.properties.rel, ['sponsored']);
});

test('non-anchor elements and childless nodes do not crash the walk', () => {
  const img = { type: 'element', tagName: 'img', properties: { src: 'https://nomadesim.com/a.png' } };
  const text = { type: 'text', value: 'https://nomadesim.com/' };
  assert.doesNotThrow(() => rehypePartnerRel()(tree(img, text)));
  assert.equal(img.properties.rel, undefined);
});

// ---- component-rendered links -----------------------------------------------
// The "Sources & verification" list and the /updates/ feed build their anchors
// in .astro, so they never reach the rehype plugin. They ask for the rel here.
// This gap shipped once: adding a partner URL to a page's verified_against
// produced an unqualified partner link, caught by the dist guard below.

test('outboundRel appends sponsored only for partner links', () => {
  assert.equal(outboundRel('https://www.nomadesim.com/china-eSIM', undefined, FIXTURE), 'nofollow noopener sponsored');
  assert.equal(outboundRel('//nomadesim.com/x', undefined, FIXTURE), 'nofollow noopener sponsored');
  assert.equal(outboundRel('https://www.airalo.com/china-esim', undefined, FIXTURE), 'nofollow noopener');
  assert.equal(outboundRel('https://esim.holafly.com/esim-china/', undefined, FIXTURE), 'nofollow noopener');
  assert.equal(outboundRel('https://en.nia.gov.cn/x', undefined, FIXTURE), 'nofollow noopener');
});

test('outboundRel honours a custom base rel and never duplicates', () => {
  assert.equal(outboundRel('https://nomadesim.com/x', 'noopener', FIXTURE), 'noopener sponsored');
  assert.equal(outboundRel('https://nomadesim.com/x', 'noopener sponsored', FIXTURE), 'noopener sponsored');
  assert.equal(outboundRel('https://example.test/x', 'noopener', FIXTURE), 'noopener');
});

// With the live roster empty, the shipped default must qualify nothing at all.
test('outboundRel qualifies nothing while the partner roster is empty', () => {
  assert.equal(PARTNER_DOMAINS.length, 0, 'update this test when a partner is added back');
  assert.equal(outboundRel('https://www.nomadesim.com/china-eSIM'), 'nofollow noopener');
  assert.equal(outboundRel('https://example.test/x', 'noopener'), 'noopener');
});

// ---- pipeline wiring -------------------------------------------------------
// The unit tests above import the plugin directly, so they all pass even if the
// plugin is never registered. This renders markdown through the *configured*
// pipeline, so deleting the `rehypePlugins` line in astro.config.mjs fails here.

test('the partner-rel plugin is registered in the configured markdown pipeline', async () => {
  const [{ createMarkdownProcessor }, { default: astroConfig }] = await Promise.all([
    import('@astrojs/markdown-remark'),
    import('../astro.config.mjs'),
  ]);
  const processor = await createMarkdownProcessor({
    remarkPlugins: astroConfig.markdown?.remarkPlugins ?? [],
    rehypePlugins: astroConfig.markdown?.rehypePlugins ?? [],
  });
  // With the roster empty the pipeline cannot stamp anything, so an end-to-end
  // "was it stamped" assertion is not available until a partner exists again. The
  // thing that must not silently rot in the meantime is the registration itself —
  // deleting the `rehypePlugins` line would otherwise go unnoticed and the next
  // partner link would ship unqualified. Pin it by identity.
  const registered = astroConfig.markdown?.rehypePlugins ?? [];
  assert.ok(
    registered.includes(rehypePartnerRel),
    'rehype-partner-rel must stay registered in astro.config.mjs rehypePlugins',
  );

  const { code } = await processor.render(
    '[Nomad eSIM](https://www.nomadesim.com/china-eSIM) and [Airalo](https://www.airalo.com/china-esim).',
  );
  const anchors = [...code.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]);
  assert.equal(anchors.length, 2, `expected both anchors in rendered output:\n${code}`);
  for (const tag of anchors) {
    assert.doesNotMatch(tag, /sponsored/, 'nothing may be qualified while the roster is empty');
  }
});

// ---- component call sites ---------------------------------------------------
// The dist guard only catches these when partner content happens to be present,
// so pin the wiring itself: reverting either call site to a hard-coded rel must
// fail here, not wait for a content change to expose it.

test('the components that render outbound source links ask for outboundRel', () => {
  for (const rel of [
    ['src/layouts/GuideLayout.astro', /rel=\{outboundRel\(src\)\}/],
    ['src/pages/updates.astro', /rel=\{outboundRel\(src\.url\)\}/],
  ]) {
    const [file, pattern] = rel;
    const src = readFileSync(join(here, '..', file), 'utf8');
    assert.match(src, /from ['"](\.\.\/)+lib\/partner-links\.mjs['"]/, `${file} must import the partner-link policy`);
    assert.match(src, pattern, `${file} must set rel via outboundRel, not a hard-coded string`);
    assert.doesNotMatch(src, /rel="nofollow noopener"/, `${file} must not hard-code an outbound rel`);
  }
});

// ---- build output ----------------------------------------------------------
// Guards the real contract: whatever the content says, no built page may link
// to a partner domain without the qualifier. Currently vacuous — the first
// partner link arrives via the wiki sync — and it only runs at all because an
// earlier test file builds dist/ in a before() hook, so treat it as a bonus
// net: the wiring test above is what actually pins the registration.

const ROOT = join(here, '..');
const DIST = join(ROOT, 'dist');

// Build on demand rather than hoping dist/ already exists. It previously did —
// but only because listing-pages-seo.test.mjs builds it in a before() hook and
// sorts earlier alphabetically under --test-concurrency=1. Renaming either file
// would have turned this guard green-but-inert with no signal, which for a guard
// whose whole job is catching unqualified paid links is the worst failure mode.
// (Same accident currently skips guide-layout-schema.test.mjs's dist assertions.)
function ensureBuilt() {
  if (existsSync(join(DIST, 'index.html'))) return;
  execFileSync('npx', ['astro', 'build'], { cwd: ROOT, stdio: 'ignore' });
}

before(() => ensureBuilt(), { timeout: 180_000 });

function collectHtml(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) collectHtml(path, out);
    else if (entry.name.endsWith('.html')) out.push(path);
  }
  return out;
}

// Two directions, and the second one is why this guard is worth more now than it
// was while a partnership existed:
//   under-qualified — a link to a rostered partner that is missing rel="sponsored"
//   over-qualified  — anything carrying rel="sponsored" that is NOT on the roster,
//                     i.e. a compensated placement that shipped without being
//                     declared here. With the roster empty this reduces to "no page
//                     may emit rel=sponsored at all", which is the state we want to
//                     hold until a new arrangement is deliberately added.
test('built pages carry rel="sponsored" on exactly the rostered partner links', () => {
  const underQualified = [];
  const overQualified = [];
  for (const file of collectHtml(DIST)) {
    const html = readFileSync(file, 'utf8');
    for (const m of html.matchAll(/<a\b[^>]*>/g)) {
      const tag = m[0];
      const href = tag.match(/\shref="([^"]*)"/)?.[1];
      const rel = tag.match(/\srel="([^"]*)"/)?.[1] ?? '';
      const sponsored = rel.split(/\s+/).includes('sponsored');
      const partner = Boolean(href) && isPartnerUrl(href, PARTNER_DOMAINS);
      if (partner && !sponsored) underQualified.push(`${file}: ${tag}`);
      if (sponsored && !partner) overQualified.push(`${file}: ${tag}`);
    }
  }
  assert.deepEqual(underQualified, [], `partner links missing rel="sponsored":\n${underQualified.join('\n')}`);
  assert.deepEqual(
    overQualified, [],
    'rel="sponsored" on a link whose host is not in PARTNER_DOMAINS — either the ' +
      `roster is out of date or an undisclosed paid link shipped:\n${overQualified.join('\n')}`,
  );
});
