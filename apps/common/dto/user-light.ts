import { z } from "zod";

export const userLightSchema = z.object({
  id: z.string().uuid(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  deletedAt: z.date().nullable(),
});

export type UserLight = z.infer<typeof userLightSchema>;
