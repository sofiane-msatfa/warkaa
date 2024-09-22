import { z } from "zod";
import { activityCreateRequestSchema } from "./activity-create-request.js";
import { addressCreateRequestSchema } from "./address-create-request.js";
import { contactCreateRequestSchema } from "./contact-create-request.js";
import { denominationCreateRequestSchema } from "./denomination-create-request.js";

export const branchCreateRequestSchema = z.object({
  branchNumber: z.string(),
  startDate: z.coerce.date().optional(),
  enterpriseNumber: z.string(),
  activities: z.array(activityCreateRequestSchema).optional(),
  addresses: z.array(addressCreateRequestSchema).optional(),
  contacts: z.array(contactCreateRequestSchema).optional(),
  denominations: z.array(denominationCreateRequestSchema).optional(),
});

export type BranchCreateRequest = z.infer<typeof branchCreateRequestSchema>;
