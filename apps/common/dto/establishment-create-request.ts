import { z } from "zod";

export const establishmentCreateRequestSchema = z.object({
  establishmentNumber: z.string(),
  startDate: z.coerce.date().optional(),
  enterpriseNumber: z.string(),
});

export type EstablishmentCreateRequest = z.infer<
  typeof establishmentCreateRequestSchema
>;
