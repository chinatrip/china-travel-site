import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildLlmsFullTxt } from '../lib/llms.mjs';

// /llms-full.txt — the llms.txt "full" variant: every content page's complete
// markdown body in one file, so an LLM can ingest the whole site in a single
// request. Generated at build time from the same collections as /llms.txt.
export const GET: APIRoute = async () => {
  const guides = await getCollection('guides', ({ data }) => data.status === 'audited');
  const apps = await getCollection('apps', ({ data }) => data.status === 'audited');

  return new Response(buildLlmsFullTxt({ guides, apps }), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
