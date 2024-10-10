import type { EstablishmentCreateRequest } from "@common/dto/establishment-create-request.js";
import type { Establishment } from "@/domain/entity/establishment.js";
import type { AsyncOption } from "@/application/types/async-option.js";
import type { ContactCreateRequest } from "@common/dto/contact-create-request.js";
import type { ActivityCreateRequest } from "@common/dto/activity-create-request.js";
import type { DenominationCreateRequest } from "@common/dto/denomination-create-request.js";
import type { AddressCreateRequest } from "@common/dto/address-create-request.js";

export interface EstablishmentRepository {
  create(establishment: EstablishmentCreateRequest): AsyncOption<Establishment>;
  upsert(establishment: EstablishmentCreateRequest): AsyncOption<Establishment>;
  bulkUpsert(establishments: EstablishmentCreateRequest[]): Promise<void>;
  bulkAddContacts(contacts: ContactCreateRequest[]): Promise<void>;
  bulkAddActivities(activities: ActivityCreateRequest[]): Promise<void>;
  bulkAddDenominations(
    denominations: DenominationCreateRequest[]
  ): Promise<void>;
  bulkAddAddresses(addresses: AddressCreateRequest[]): Promise<void>;
}
