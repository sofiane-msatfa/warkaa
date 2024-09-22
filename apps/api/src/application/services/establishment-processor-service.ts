import type { EstablishmentCsvRow } from "@/domain/internal/establishment-csv-row.js";
import type { EstablishmentRepository } from "@/domain/gateway/establishment-repository.js";
import { inject, injectable } from "inversify";
import { Type } from "@/container/types.js";
import { AbstractProcessorService } from "./abstract-processor-service.js";
import {
  establishmentCreateRequestSchema,
  type EstablishmentCreateRequest,
} from "@common/dto/establishment-create-request.js";
import { parseDate } from "../utils/date.js";
import { Collection } from "@/domain/enum/collection.js";

@injectable()
export class EstablishmentProcessorService extends AbstractProcessorService<
  EstablishmentCsvRow,
  EstablishmentCreateRequest
> {
  constructor(
    @inject(Type.EstablishmentRepository)
    private readonly establishmentRepository: EstablishmentRepository
  ) {
    super();
  }

  protected collection = Collection.Enterprise;

  protected headers = ["EstablishmentNumber", "StartDate", "EnterpriseNumber"];

  protected override batchSize = 10_000;

  protected batchAction = async (batch: EstablishmentCreateRequest[]) => {
    await this.establishmentRepository.bulkUpsert(batch);
  };

  protected tranform(row: EstablishmentCsvRow): EstablishmentCreateRequest {
    return {
      establishmentNumber: row.EstablishmentNumber,
      enterpriseNumber: row.EnterpriseNumber,
      startDate: parseDate(row.StartDate),
    };
  }

  protected validate(row: EstablishmentCreateRequest): boolean {
    return establishmentCreateRequestSchema.safeParse(row).success;
  }
}
