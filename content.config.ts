import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const base = z.object({title:z.string(), description:z.string(), published:z.coerce.date(), draft:z.boolean().default(false), tags:z.array(z.string()).default([])});
export const collections = {
 essays: defineCollection({loader:glob({pattern:'**/*.{md,mdx}',base:'./src/content/essays'}),schema:base}),
 principles: defineCollection({loader:glob({pattern:'**/*.{md,mdx}',base:'./src/content/principles'}),schema:base.extend({number:z.number().optional()})})
};
