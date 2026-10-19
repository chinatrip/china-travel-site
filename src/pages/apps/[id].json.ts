import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { getCollection } from 'astro:content';
import { buildPageModel } from '../../lib/facts.mjs';

// /apps/<slug>.json — machine model for one app page (same shape as guides).
export const getStaticPaths = (async () => {
  const apps = await getCollection('apps', ({ data }) => data.status === 'audited');
  return apps.map((entry) => ({
    params: { id: entry.id },
    props: { model: buildPageModel(entry, 'apps') },
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
