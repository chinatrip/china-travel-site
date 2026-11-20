import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Coerce dates to strings since YAML auto-parses date-like values as Date objects
const dateOrString = z.union([z.coerce.string(), z.date().transform((d) => d.toISOString().split('T')[0])]);

// Flexible schema matching the wiki's actual front matter format
const contentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  faqs: z.array(z.object({ q: z.string(), a: z.string(), sources: z.array(z.string().url()).optional(), checked_at: dateOrString.optional(), fact_number: z.number().int().positive().optional(), aliases: z.array(z.object({ q: z.string(), fact_number: z.number().int().positive() })).optional() })).optional(),
  date: dateOrString.optional(),
  reader_question_numbers: z.record(z.string(), z.number().int().positive()).optional(),
  last_verified: dateOrString.optional(),
  verified_against: z.array(z.string()).optional(),
  verified_by: z.string().optional(),
  sources: z.array(z.string()).optional(),
  related: z.array(z.string()).optional(),
  status: z.string().default('audited'),
  category: z.string().optional(),
  volatility: z.string().optional(),
  // i18n (translated pages only): locale + provenance link back to the English
  // source, so the freshness check can flag a translation when its source page
  // is re-verified. See src/lib/i18n.mjs + scripts/check-translation-freshness.mjs.
  lang: z.string().optional(),
  source_en: z.string().optional(),
  source_last_verified: dateOrString.optional(),
  review: z.object({
    status: z.string().optional(),
    page_audit: dateOrString.optional(),
    citation_check: dateOrString.optional(),
    notes: z.string().optional(),
  }).optional(),
}).transform((page) => ({
  ...page,
  status: page.status === 'audited' && page.review?.status === 'audited' && page.verified_against?.length ? 'audited' : 'draft',
}));

// Top-level `*.md` only, so a `<collection>/es/` translation subfolder is NOT
// pulled into the English collections — every `getCollection('guides')` across
// the site stays English-only with no per-call-site filtering. Translated pages
// load via the parallel `guidesEs` collection and render under /es/guides/.
const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '*.md' }),
  schema: contentSchema,
});

const apps = defineCollection({
  loader: glob({ base: './src/content/apps', pattern: '*.md' }),
  schema: contentSchema,
});

const guidesEs = defineCollection({
  loader: glob({ base: './src/content/guides/es', pattern: '*.md' }),
  schema: contentSchema,
});

export const collections = { guides, apps, guidesEs };
