import type { Activity } from "./activity.js";
import type { Address } from "./address.js";
import type { Contact } from "./contact.js";
import type { Denomination } from "./denomination.js";
import type { Enterprise } from "./enterprise.js";

export interface Branch {
  id: string;
  startDate: Date;
  enterprise?: Enterprise | null;
  enterpriseNumber: string;
  activities: Activity[];
  addresses: Address[];
  contacts: Contact[];
  denominations: Denomination[];
}
