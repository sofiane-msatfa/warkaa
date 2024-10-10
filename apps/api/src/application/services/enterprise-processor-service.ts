import type { EnterpriseCsvRow } from "@/domain/internal/enterprise-csv-row.js";
import type { EnterpriseRepository } from "@/domain/gateway/enterprise-repository.js";
import { inject, injectable } from "inversify";
import { Type } from "@/container/types.js";
import {
  enterpriseCreateRequestSchema,
  type EnterpriseCreateRequest,
} from "@common/dto/enterprise-create-request.js";
import { AbstractProcessorService } from "./abstract-processor-service.js";
import { parseDate } from "../utils/date.js";
import { Collection } from "@/domain/enum/collection.js";

@injectable()
export class EnterpriseProcessorService extends AbstractProcessorService<
  EnterpriseCsvRow,
  EnterpriseCreateRequest
> {
  constructor(
    @inject(Type.EnterpriseRepository)
    private readonly enterpriseRepository: EnterpriseRepository
  ) {
    super();
  }

  protected collection = Collection.Enterprise;

  protected headers = [
    "EnterpriseNumber",
    "Status",
    "JuridicalSituation",
    "TypeOfEnterprise",
    "JuridicalForm",
    "JuridicalFormCAC",
    "StartDate",
  ];

  protected override batchSize = 10_000;

  protected batchAction = async (batch: EnterpriseCreateRequest[]) => {
    await this.enterpriseRepository.bulkUpsert(batch);
  };

  protected tranform(row: EnterpriseCsvRow): EnterpriseCreateRequest {
    return {
      enterpriseNumber: row.EnterpriseNumber,
      status: row.Status,
      juridicalSituation: row.JuridicalSituation,
      typeOfEnterprise: row.TypeOfEnterprise,
      juridicalForm: row.JuridicalForm,
      juridicalFormCAC: row.JuridicalFormCAC,
      startDate: parseDate(row.StartDate),
    };
  }

  protected validate(row: EnterpriseCreateRequest): boolean {
    return enterpriseCreateRequestSchema.safeParse(row).success;
  }
}
