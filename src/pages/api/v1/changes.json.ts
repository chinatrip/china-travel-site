import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildPageModel, SITE, SCHEMA_VERSION } from '../../../lib/facts.mjs';
import { contentChanges, snapshotChanges } from '../../../lib/git-changes.mjs';

// /api/v1/changes.json — what changed, when, and which page models to refresh.
// Source is git history in the deployed checkout; when that is unavailable the
// feed degrades to a verified-date snapshot, explicitly labelled as such so an
// agent never mistakes it for a real changelog.
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

  const { source, entries } = contentChanges();
  const changes = source === 'git' ? entries : snapshotChanges(models);

  return new Response(
    JSON.stringify(
      {
        schema_version: SCHEMA_VERSION,
        site: SITE,
        generated_at: new Date().toISOString(),
        source,
        window_days: source === 'git' ? 180 : null,
        count: changes.length,
        changes,
      },
      null,
      2,
    ),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    },
  );
};
