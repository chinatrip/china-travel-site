import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildPageModel, buildPagesIndex } from '../../../lib/facts.mjs';

// /api/v1/pages.json — discovery index for AI agents.
// One entry per published page, with the tldr + URLs needed to fetch the full
// machine model. The full facts live in the per-page JSON so this stays small.
export const GET: APIRoute = async () => {
  const [guides, apps, guidesEs] = await Promise.all([
    getCollection('guides', ({ data }) => data.status === 'audited'),
    getCollection('apps', ({ data }) => data.status === 'audited'),
    getCollection('guidesEs', ({ data }) => data.status === 'audited'),
  ]);
  const models = [
    ...guides.map((entry) => buildPageModel(entry, 'guides')),
    ...apps.map((entry) => buildPageModel(entry, 'apps')),
    ...guidesEs.map((entry) => buildPageModel(entry, 'guidesEs')),
  ];

  return new Response(JSON.stringify(buildPagesIndex(models), null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
