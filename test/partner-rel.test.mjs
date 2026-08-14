import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import rehypePartnerRel, {
  isPartnerUrl,
  withSponsored,
  PARTNER_DOMAINS,
} from '../src/plugins/rehype-partner-rel.mjs';

// Outbound links to commercial partners must carry rel="sponsored" (Google's
// value for compensated / link-exchange placements). The plugin applies it at
// render time; these tests pin the matching rules, the merge behaviour, and —
// against a built dist — that no partner link ever ships unqualified.

const here = dirname(fileURLToPath(import.meta.url));

// ---- URL matching ----------------------------------------------------------

test('matches a partner domain and its subdomains', () => {
  assert.equal(isPartnerUrl('https://www.nomadesim.com/china-eSIM'), true);
  assert.equal(isPartnerUrl('https://nomadesim.com/'), true);
  assert.equal(isPartnerUrl('http://help.nomadesim.com/article'), true);
  assert.equal(isPartnerUrl('https://NOMADESIM.COM/x'), true, 'host match is case-insensitive');
});

test('does not match lookalike or unrelated domains', () => {
  assert.equal(isPartnerUrl('https://notnomadesim.com/'), false, 'suffix lookalike must not match');
  assert.equal(isPartnerUrl('https://nomadesim.com.evil.test/'), false, 'domain-in-subdomain must not match');
  assert.equal(isPartnerUrl('https://nomadesim.com@attacker.test/'), false, 'userinfo must not be read as the host');
  assert.equal(isPartnerUrl('https://xn--nmadesim-p1a.com/'), false, 'punycode homograph must not match');
  assert.equal(isPartnerUrl('https://www.airalo.com/china-esim'), false);
  assert.equal(isPartnerUrl('https://esim.holafly.com/esim-china/'), false);
});

// Both of these render as working outbound partner links, so missing them
// would ship an unqualified paid link — the dangerous direction.
test('matches partner links that are protocol-relative or use a trailing-dot FQDN', () => {
  assert.equal(isPartnerUrl('//nomadesim.com/x'), true, 'protocol-relative link resolves to https');
  assert.equal(isPartnerUrl('//www.nomadesim.com/china-eSIM'), true);
  assert.equal(isPartnerUrl('https://nomadesim.com./x'), true, 'trailing root label is the same host');
  assert.equal(isPartnerUrl('https://www.nomadesim.com./x'), true);
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
  rehypePartnerRel()(tree(partner, other, internal));

  assert.deepEqual(partner.properties.rel, ['sponsored']);
  assert.equal(other.properties.rel, undefined, 'non-partner link must not be touched');
  assert.equal(internal.properties.rel, undefined, 'internal link must not be touched');
});

test('plugin is idempotent and preserves existing rel', () => {
  const node = a('https://nomadesim.com/x', { rel: ['noopener'] });
  const t = tree(node);
  rehypePartnerRel()(t);
  rehypePartnerRel()(t);
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

// ---- pipeline wiring -------------------------------------------------------
// The unit tests above import the plugin directly, so they all pass even if the
// plugin is never registered. This renders markdown through the *configured*
// pipeline, so deleting the `rehypePlugins` line in astro.config.mjs fails here.

test('the configured markdown pipeline stamps rel="sponsored" on partner links', async () => {
  const [{ createMarkdownProcessor }, { default: astroConfig }] = await Promise.all([
    import('@astrojs/markdown-remark'),
    import('../astro.config.mjs'),
  ]);
  const processor = await createMarkdownProcessor({
    remarkPlugins: astroConfig.markdown?.remarkPlugins ?? [],
    rehypePlugins: astroConfig.markdown?.rehypePlugins ?? [],
  });
  const { code } = await processor.render(
    '[Nomad eSIM](https://www.nomadesim.com/china-eSIM) and [Airalo](https://www.airalo.com/china-esim).',
  );

  const anchors = [...code.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]);
  const partner = anchors.find((t) => t.includes('nomadesim.com'));
  const other = anchors.find((t) => t.includes('airalo.com'));

  assert.ok(partner, `expected a partner anchor in rendered output:\n${code}`);
  assert.match(partner, /\srel="(?:[^"]*\s)?sponsored(?:\s[^"]*)?"/, 'partner link must be qualified by the configured pipeline');
  assert.ok(other, 'expected the non-partner anchor too');
  assert.doesNotMatch(other, /\srel=/, 'non-partner link must be left alone');
});

// ---- build output ----------------------------------------------------------
// Guards the real contract: whatever the content says, no built page may link
// to a partner domain without the qualifier. Currently vacuous — the first
// partner link arrives via the wiki sync — and it only runs at all because an
// earlier test file builds dist/ in a before() hook, so treat it as a bonus
// net: the wiring test above is what actually pins the registration.

const DIST = join(here, '..', 'dist');
const distSkip = !existsSync(DIST) && 'dist/ not built (unit tests cover the contract)';

function collectHtml(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) collectHtml(path, out);
    else if (entry.name.endsWith('.html')) out.push(path);
  }
  return out;
}

test('no built page links to a partner domain without rel="sponsored"', { skip: distSkip }, () => {
  const offenders = [];
  for (const file of collectHtml(DIST)) {
    const html = readFileSync(file, 'utf8');
    for (const m of html.matchAll(/<a\b[^>]*>/g)) {
      const tag = m[0];
      const href = tag.match(/\shref="([^"]*)"/)?.[1];
      if (!href || !isPartnerUrl(href, PARTNER_DOMAINS)) continue;
      const rel = tag.match(/\srel="([^"]*)"/)?.[1] ?? '';
      if (!rel.split(/\s+/).includes('sponsored')) offenders.push(`${file}: ${tag}`);
    }
  }
  assert.deepEqual(offenders, [], `partner links missing rel="sponsored":\n${offenders.join('\n')}`);
});
