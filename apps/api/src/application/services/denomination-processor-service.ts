import { inject, injectable } from "inversify";
import { Type } from "@/container/types.js";
import { AbstractProcessorService } from "./abstract-processor-service.js";
import type { BranchRepository } from "@/domain/gateway/branch-repository.js";
import type { EnterpriseRepository } from "@/domain/gateway/enterprise-repository.js";
import type { EstablishmentRepository } from "@/domain/gateway/establishment-repository.js";
import {
  denominationCreateRequestSchema,
  type DenominationCreateRequest,
} from "@common/dto/denomination-create-request.js";
import type { DenominationCsvRow } from "@/domain/internal/denomination-csv-row.js";
import { Collection } from "@/domain/enum/collection.js";

@injectable()
export class DenominationProcessorService extends AbstractProcessorService<
  DenominationCsvRow,
  DenominationCreateRequest
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

  protected headers = [
    "EntityNumber",
    "Language",
    "TypeOfDenomination",
    "Denomination",
  ];

  protected batchAction = async (batch: DenominationCreateRequest[]) => {
    await Promise.all([
      this.branchRepository.bulkAddDenominations(batch),
      this.enterpriseRepository.bulkAddDenominations(batch),
      this.establishmentRepository.bulkAddDenominations(batch),
    ]);
  };

  protected tranform(row: DenominationCsvRow): DenominationCreateRequest {
    return {
      entityNumber: row.EntityNumber,
      denomination: row.Denomination,
      language: row.Language,
      typeOfDenomination: row.TypeOfDenomination,
    };
  }

  protected validate(row: DenominationCreateRequest): boolean {
    return denominationCreateRequestSchema.safeParse(row).success;
  }
}
