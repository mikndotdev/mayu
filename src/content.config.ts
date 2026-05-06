import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    coverImage: z.string().optional(),
    date: z.date(),
    timeToRead: z.number().optional(),
    creator: z.string().optional(),
    tags: z.array(z.string()).optional(),
    relatedPosts: z.array(reference("blog")).optional(),
  }),
});

export const collections = { blog };
