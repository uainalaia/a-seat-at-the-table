import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/chapters' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    description: z.string(),
    objective: z.string(),
    minutes: z.number(),
    takeaway: z.string(),
    sourceIds: z.array(z.enum(['carreno', 'formal', 'table', 'manners', 'tcu', 'vt', 'wmu'])),
  }),
});
export const collections = { chapters };
