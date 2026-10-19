import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { getCollection } from 'astro:content';
import { buildPageModel } from '../../lib/facts.mjs';

// /guides/<slug>.json — machine model for one guide: tldr, facts (with source
// URLs, verified_at, confidence, stale_after), sections, content hash.
export const getStaticPaths = (async () => {
  const guides = await getCollection('guides', ({ data }) => data.status === 'audited');
  return guides.map((entry) => ({
    params: { id: entry.id },
    props: { model: buildPageModel(entry, 'guides') },
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
