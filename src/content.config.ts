import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      year: z.number().int(),
      role: z.string(),
      stack: z.array(z.string()),
      /** Optional cover image, relative to the .mdx file. A typographic card is shown without one. */
      cover: image().optional(),
      coverAlt: z.string().optional(),
      links: z
        .object({
          repo: z.url().optional(),
          live: z.url().optional(),
        })
        .default({}),
      /** Featured projects appear on the home page. */
      featured: z.boolean().default(false),
      /** Lower numbers sort first. */
      order: z.number().default(100),
    }),
});

export const collections = { projects };
