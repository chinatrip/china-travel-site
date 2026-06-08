// remark plugin: normalize internal markdown links to use a trailing slash, so
// they match the site's directory-format canonical URLs (`/apps/`) and never
// trigger Cloudflare Pages' 307 redirect. Runs AFTER remark-wikilinks so both
// plain `[text](/guides/x)` links and `[[wikilink]]` output are normalized.
// Idempotent. No external deps — manual tree walk.

export function normalizeInternalUrl(url) {
  if (typeof url !== 'string') return url;
  if (!url.startsWith('/') || url.startsWith('//')) return url; // external / protocol-relative
  if (url.startsWith('/_astro/')) return url; // build assets
  let cut = url.length;
  const h = url.indexOf('#');
  const q = url.indexOf('?');
  if (h !== -1) cut = Math.min(cut, h);
  if (q !== -1) cut = Math.min(cut, q);
  const path = url.slice(0, cut);
  const rest = url.slice(cut); // leading '#...' and/or '?...'
  if (path === '/' || path === '') return url; // root
  const lastSeg = path.split('/').pop();
  if (lastSeg && lastSeg.includes('.')) return url; // a file, e.g. /llms.txt
  if (path.endsWith('/')) return url; // already normalized
  return path + '/' + rest;
}

export default function remarkTrailingSlash() {
  return (tree) => {
    const walk = (node) => {
      if (!node || typeof node !== 'object') return;
      if ((node.type === 'link' || node.type === 'definition') && typeof node.url === 'string') {
        node.url = normalizeInternalUrl(node.url);
      }
      if (Array.isArray(node.children)) {
        for (const child of node.children) walk(child);
      }
    };
    walk(tree);
  };
}
