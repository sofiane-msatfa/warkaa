import { z } from "zod";

export const userLight = z.object({
  id: z.string().uuid(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  deletedAt: z.date().nullable(),
});

export type UserLight = z.infer<typeof userLight>;
