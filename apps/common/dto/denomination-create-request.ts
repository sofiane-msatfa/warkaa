import { z } from "zod";

export const denominationCreateRequestSchema = z.object({
  entityNumber: z.string(),
  language: z.string().optional(),
  typeOfDenomination: z.string().optional(),
  denomination: z.string(),
});

export type DenominationCreateRequest = z.infer<
  typeof denominationCreateRequestSchema
>;
