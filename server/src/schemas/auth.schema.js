import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(72),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const refreshSchema = z.object({
  body: z
    .object({
      refreshToken: z.string().min(20).optional(),
    })
    .default({}),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const logoutSchema = z.object({
  body: z
    .object({
      refreshToken: z.string().min(20).optional(),
    })
    .default({}),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});
