import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildLlmsTxt } from '../lib/llms.mjs';

// /llms.txt — build-time generated index for AI engines (https://llmstxt.org/).
// Content pages come from the collections, so new wiki pages are included
// automatically; static routes live in SITE_PAGES inside src/lib/llms.mjs
// (where /search/ is intentionally excluded — see comment there).
export const GET: APIRoute = async () => {
  const guides = await getCollection('guides', ({ data }) => data.status === 'audited');
  const apps = await getCollection('apps', ({ data }) => data.status === 'audited');

  return new Response(buildLlmsTxt({ guides, apps }), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
