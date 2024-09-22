import { z } from "zod";

export const activityCreateRequestSchema = z.object({
  entityNumber: z.string(),
  activityGroup: z.string(),
  naceVersion: z.string().optional(),
  naceCode: z.string().optional(),
  classification: z.string().optional(),
});

export type ActivityCreateRequest = z.infer<typeof activityCreateRequestSchema>;
