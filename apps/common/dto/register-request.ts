import { z } from "zod";

export const registerRequestSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
