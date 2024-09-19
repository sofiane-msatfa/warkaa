import type { Activity } from "./activity.js";
import type { Address } from "./address.js";
import type { Contact } from "./contact.js";
import type { Denomination } from "./denomination.js";

export interface Establishment {
  establishmentNumber: string;
  startDate: Date;
  enterpriseNumber: string;
  activities: Activity[];
  addresses: Address[];
  contacts: Contact[];
  denominations: Denomination[];
}
