import type { EnterpriseCreateRequest } from "@common/dto/enterprise-create-request.js";
import type { Enterprise } from "../entity/enterprise.js";
import type { ContactCreateRequest } from "@common/dto/contact-create-request.js";
import type { ActivityCreateRequest } from "@common/dto/activity-create-request.js";
import type { DenominationCreateRequest } from "@common/dto/denomination-create-request.js";
import type { AddressCreateRequest } from "@common/dto/address-create-request.js";

export interface EnterpriseRepository {
  create(enterprise: EnterpriseCreateRequest): Promise<Enterprise>;
  upsert(enterprise: EnterpriseCreateRequest): Promise<Enterprise>;
  bulkUpsert(enterprises: EnterpriseCreateRequest[]): Promise<void>;
  bulkAddContacts(contacts: ContactCreateRequest[]): Promise<void>;
  bulkAddActivities(activities: ActivityCreateRequest[]): Promise<void>;
  bulkAddDenominations(
    denominations: DenominationCreateRequest[]
  ): Promise<void>;
  bulkAddAddresses(addresses: AddressCreateRequest[]): Promise<void>;
}
