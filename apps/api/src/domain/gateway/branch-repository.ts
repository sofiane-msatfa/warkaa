import type { BranchCreateRequest } from "@common/dto/branch-create-request.js";
import type { Branch } from "@/domain/entity/branch.js";
import type { AsyncOption } from "@/application/types/async-option.js";
import type { ContactCreateRequest } from "@common/dto/contact-create-request.js";
import type { ActivityCreateRequest } from "@common/dto/activity-create-request.js";
import type { DenominationCreateRequest } from "@common/dto/denomination-create-request.js";
import type { AddressCreateRequest } from "@common/dto/address-create-request.js";

export interface BranchRepository {
  create(branch: BranchCreateRequest): AsyncOption<Branch>;
  upsert(branch: BranchCreateRequest): AsyncOption<Branch>;
  bulkUpsert(branches: BranchCreateRequest[]): Promise<void>;
  bulkAddContacts(contacts: ContactCreateRequest[]): Promise<void>;
  bulkAddActivities(activities: ActivityCreateRequest[]): Promise<void>;
  bulkAddDenominations(
    denominations: DenominationCreateRequest[]
  ): Promise<void>;
  bulkAddAddresses(addresses: AddressCreateRequest[]): Promise<void>;
  findById(id: string): AsyncOption<Branch>;
  findAll(): Promise<Branch[]>;
}
