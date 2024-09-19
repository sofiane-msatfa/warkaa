import { z } from "zod";

export const branchCreateRequestSchema = z.object({
  id: z.string().optional(),
  startDate: z.coerce.date().optional(),
  enterpriseNumber: z.string(),
  denomination: z.string().optional(),
  address: z.string().optional(),
  activity: z.array(z.string()).optional(),
  contact: z.array(z.string()).optional(),
  establishment: z.array(z.string()).optional(),
});

export type BranchCreateRequest = z.infer<typeof branchCreateRequestSchema>;
