import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { getCollection } from 'astro:content';
import { buildFactDetail, buildPageModel, buildReaderGuidanceDetails, SITE, SCHEMA_VERSION } from '../../../../lib/facts.mjs';

// /api/v1/facts/<fact-id>.json — one addressable claim with its provenance.
// Ids look like `sim-card.faq.3` or `es.visa-types.faq.1`.
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
  const paths = entries.flatMap(([entry, collection]) => {
    const model = buildPageModel(entry, collection);
    const verifiedPaths = model.facts.flatMap((fact) => {
      const detail = buildFactDetail(model, fact.id);
      const faq = entry.data.faqs?.find((candidate) => candidate.q === fact.question);
      const paths = [{ params: { id: fact.id }, props: { detail } }];
      for (const alias of faq?.aliases ?? []) {
        const id = fact.id.replace(/\d+$/, String(alias.fact_number));
        paths.push({
          params: { id },
          props: { detail: { ...detail, fact: { ...fact, id, question: alias.q, canonical_id: fact.id } } },
        });
      }
      return paths;
    });
    const guidance = buildReaderGuidanceDetails(model, entry.body, entry.data.reader_question_numbers);
    return [...verifiedPaths, ...guidance.map((detail) => ({
      params: { id: detail.fact.id },
      props: { detail },
    }))];
  });
  const ids = new Set<string>();
  for (const path of paths) {
    if (ids.has(path.params.id)) throw new Error(`Duplicate fact route: ${path.params.id}`);
    ids.add(path.params.id);
  }
  return paths;
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
