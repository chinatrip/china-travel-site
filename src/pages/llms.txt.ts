import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://chinaguide.ai';

export const GET: APIRoute = async () => {
  const byTitle = (a: { data: { title: string } }, b: { data: { title: string } }) =>
    a.data.title.localeCompare(b.data.title);

  const guides = (await getCollection('guides', ({ data }) => data.status === 'audited')).sort(byTitle);
  const apps = (await getCollection('apps', ({ data }) => data.status === 'audited')).sort(byTitle);

  const line = (base: string, e: { id: string; data: { title: string; description?: string; last_verified?: string } }) => {
    const desc = e.data.description ? `: ${e.data.description}` : '';
    const d = e.data.last_verified ? new Date(e.data.last_verified) : null;
    const verified = d && !isNaN(d.getTime()) ? ` (Verified ${d.toISOString().split('T')[0]})` : '';
    return `- [${e.data.title}](${SITE}/${base}/${e.id}/)${desc}${verified}`;
  };

  const body = `# ChinaGuide.ai

> Practical, source-verified travel guides for foreign visitors to China. Every page cites official sources (gov.cn, PBOC, NIA) and shows a "Last verified" date. Coverage includes visas, mobile payments, connectivity (VPN vs eSIM), transport, accommodation, safety, food, and the essential Chinese apps.

## Guides
${guides.map((g) => line('guides', g)).join('\n')}

## Apps
${apps.map((a) => line('apps', a)).join('\n')}

## About
ChinaGuide.ai helps foreign travelers get China-ready and get things done in China. Content is written to be answer-first, source-cited, and dated, for both AI engines and human readers.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
