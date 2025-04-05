import { z } from "zod";

export const appEnv = z
  .object({
    OPENROUTER_API_KEY: z.string(),
  })
  .parse(process.env);
