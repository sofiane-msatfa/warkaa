import { inject, injectable } from "inversify";
import { Type } from "@/container/types.js";
import { AbstractProcessorService } from "./abstract-processor-service.js";
import {
  contactCreateRequestSchema,
  type ContactCreateRequest,
} from "@common/dto/contact-create-request.js";
import type { ContactCsvRow } from "@/domain/internal/contact-csv-row.js";
import type { BranchRepository } from "@/domain/gateway/branch-repository.js";
import type { EnterpriseRepository } from "@/domain/gateway/enterprise-repository.js";
import type { EstablishmentRepository } from "@/domain/gateway/establishment-repository.js";
import { Collection } from "@/domain/enum/collection.js";

@injectable()
export class ContactProcessorService extends AbstractProcessorService<
  ContactCsvRow,
  ContactCreateRequest
> {
  constructor(
    @inject(Type.BranchRepository)
    private readonly branchRepository: BranchRepository,
    @inject(Type.EnterpriseRepository)
    private readonly enterpriseRepository: EnterpriseRepository,
    @inject(Type.EstablishmentRepository)
    private readonly establishmentRepository: EstablishmentRepository
  ) {
    super();
  }

  protected collection = Collection.Enterprise;

  protected headers = ["EntityNumber", "EntityContact", "ContactType", "Value"];

  protected batchAction = async (batch: ContactCreateRequest[]) => {
    await Promise.all([
      this.branchRepository.bulkAddContacts(batch),
      this.enterpriseRepository.bulkAddContacts(batch),
      this.establishmentRepository.bulkAddContacts(batch),
    ]);
  };

  protected tranform(row: ContactCsvRow): ContactCreateRequest {
    return {
      contactType: row.ContactType,
      entityContact: row.EntityContact,
      value: row.Value,
      entityNumber: row.EntityNumber,
    };
  }

  protected validate(row: ContactCreateRequest): boolean {
    return contactCreateRequestSchema.safeParse(row).success;
  }
}
