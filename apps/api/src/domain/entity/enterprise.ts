import type { Activity } from "./activity.js";
import type { Address } from "./address.js";
import type { Contact } from "./contact.js";
import type { Denomination } from "./denomination.js";

export interface Enterprise {
  enterpriseNumber: string;
  status: string;
  juridicalSituation: string;
  typeOfEnterprise: string;
  juridicalForm: string;
  juridicalFormCAC: string;
  startDate: Date;
  activities: Activity[];
  addresses: Address[];
  contacts: Contact[];
  denominations: Denomination[];
}
