import { z } from "zod";
import { activityCreateRequestSchema } from "./activity-create-request.js";
import { addressCreateRequestSchema } from "./address-create-request.js";
import { contactCreateRequestSchema } from "./contact-create-request.js";
import { denominationCreateRequestSchema } from "./denomination-create-request.js";

export const enterpriseCreateRequestSchema = z.object({
  enterpriseNumber: z.string(),
  status: z.string().optional(),
  juridicalSituation: z.string().optional(),
  typeOfEnterprise: z.string().optional(),
  juridicalForm: z.string().optional(),
  juridicalFormCAC: z.string().optional(),
  startDate: z.coerce.date().optional(),
  activities: z.array(activityCreateRequestSchema).optional(),
  addresses: z.array(addressCreateRequestSchema).optional(),
  contacts: z.array(contactCreateRequestSchema).optional(),
  denominations: z.array(denominationCreateRequestSchema).optional(),
});

export type EnterpriseCreateRequest = z.infer<
  typeof enterpriseCreateRequestSchema
>;
