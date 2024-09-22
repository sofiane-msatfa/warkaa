import { z } from "zod";

export const addressCreateRequestSchema = z.object({
  entityNumber: z.string(),
  typeOfAddress: z.string(),
  countryNL: z.string().optional(),
  countryFR: z.string().optional(),
  zipcode: z.string().optional(),
  municipalityNL: z.string().optional(),
  municipalityFR: z.string().optional(),
  streetNL: z.string().optional(),
  streetFR: z.string().optional(),
  houseNumber: z.string().optional(),
  box: z.string().optional(),
  extraAddressInfo: z.string().optional(),
  dateStrikingOff: z.coerce.date().optional(),
});

export type AddressCreateRequest = z.infer<typeof addressCreateRequestSchema>;
