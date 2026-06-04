import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Coerce dates to strings since YAML auto-parses date-like values as Date objects
const dateOrString = z.union([z.coerce.string(), z.date().transform((d) => d.toISOString().split('T')[0])]);

// Flexible schema matching the wiki's actual front matter format
const contentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  date: dateOrString.optional(),
  last_verified: dateOrString.optional(),
  verified_against: z.array(z.string()).optional(),
  verified_by: z.string().optional(),
  sources: z.array(z.string()).optional(),
  related: z.array(z.string()).optional(),
  status: z.string().default('audited'),
  category: z.string().optional(),
  volatility: z.string().optional(),
  review: z.object({
    status: z.string().optional(),
    page_audit: dateOrString.optional(),
    citation_check: dateOrString.optional(),
    notes: z.string().optional(),
  }).optional(),
});

const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '**/*.md' }),
  schema: contentSchema,
});

const apps = defineCollection({
  loader: glob({ base: './src/content/apps', pattern: '**/*.md' }),
  schema: contentSchema,
});

export const collections = { guides, apps };
