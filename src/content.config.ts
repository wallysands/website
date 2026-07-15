import { defineCollection, z } from "astro:content";

const art = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    category: z.enum(["still-life", "outdoor-plein-air"]),
    year: z.number().optional(),
    medium: z.string().optional(),
    image: z.string().optional(),
    status: z.enum(["planned", "available"]),
    description: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    year: z.string().optional(),
    tools: z.array(z.string()).default([]),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    status: z.enum(["planned", "available"]),
    image: z.string().optional(),
  }),
});

export const collections = { art, projects };
