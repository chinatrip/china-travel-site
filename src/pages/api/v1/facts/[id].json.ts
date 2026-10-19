import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { getCollection } from 'astro:content';
import { buildFactDetail, buildPageModel, SITE, SCHEMA_VERSION } from '../../../../lib/facts.mjs';

// /api/v1/facts/<fact-id>.json — one addressable claim with its provenance.
// Ids look like `sim-card.faq.3` and are stable across wording changes.
export const getStaticPaths = (async () => {
  const [guides, apps, guidesEs] = await Promise.all([
    getCollection('guides', ({ data }) => data.status === 'audited'),
    getCollection('apps', ({ data }) => data.status === 'audited'),
    getCollection('guidesEs', ({ data }) => data.status === 'audited'),
  ]);
  const entries = [
    ...guides.map((entry) => [entry, 'guides']),
    ...apps.map((entry) => [entry, 'apps']),
    ...guidesEs.map((entry) => [entry, 'guidesEs']),
  ];
  return entries.flatMap(([entry, collection]) => {
    const model = buildPageModel(entry, collection);
    return model.facts.map((fact) => ({
      params: { id: fact.id },
      props: { detail: buildFactDetail(model, fact.id) },
    }));
  });
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = ({ props }) => {
  if (!props.detail) {
    return new Response(JSON.stringify({ schema_version: SCHEMA_VERSION, site: SITE, error: 'not_found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
  return new Response(JSON.stringify(props.detail, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
