import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Schema matching the wiki's front matter format
const guidesSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  volatility: z.enum(['stable', 'moderate', 'high']).optional(),
  last_verified: z.string().optional(),
  verified_by: z.string().optional(),
  status: z.enum(['audited', 'draft']).default('draft'),
  category: z.string().optional(),
});

const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '**/*.md' }),
  schema: guidesSchema,
});

const apps = defineCollection({
  loader: glob({ base: './src/content/apps', pattern: '**/*.md' }),
  schema: guidesSchema,
});

export const collections = { guides, apps };
