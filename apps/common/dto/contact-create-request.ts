import { z } from "zod";

export const contactCreateRequestSchema = z.object({
  entityNumber: z.string(),
  entityContact: z.string().optional(),
  contactType: z.string().optional(),
  value: z.string(),
});

export type ContactCreateRequest = z.infer<typeof contactCreateRequestSchema>;
