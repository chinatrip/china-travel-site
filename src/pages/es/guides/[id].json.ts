import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { getCollection } from 'astro:content';
import { buildPageModel } from '../../../lib/facts.mjs';

// /es/guides/<slug>.json — machine model for a Spanish translation.
export const getStaticPaths = (async () => {
  const guides = await getCollection('guidesEs', ({ data }) => data.status === 'audited');
  return guides.map((entry) => ({
    params: { id: entry.id },
    props: { model: buildPageModel(entry, 'guidesEs') },
  }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = ({ props }) =>
  new Response(JSON.stringify(props.model, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
