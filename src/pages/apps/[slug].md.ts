import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { getCollection } from 'astro:content';
import { buildPageMarkdown, publishedChecker } from '../../lib/llms.mjs';

// /apps/<slug>.md — standalone markdown representation of each app page
// (issue #56). Served two ways: directly, and by the worker when a client
// sends `Accept: text/markdown` for /apps/<slug>/. The .md extension keeps
// the path file-like on purpose, so the worker's redirect normalization
// (lowercasing / trailing slash) skips it.
export const getStaticPaths = (async () => {
  const apps = await getCollection('apps', ({ data }) => data.status === 'audited');
  return apps.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = async ({ props }) => {
  const guides = await getCollection('guides', ({ data }) => data.status === 'audited');
  const apps = await getCollection('apps', ({ data }) => data.status === 'audited');

  return new Response(
    buildPageMarkdown(props.entry, publishedChecker({ guides, apps })),
    { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } },
  );
};
