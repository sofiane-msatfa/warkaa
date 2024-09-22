import type { BranchCsvRow } from "@/domain/internal/branch-csv-row.js";
import type { BranchRepository } from "@/domain/gateway/branch-repository.js";
import { inject, injectable } from "inversify";
import { Type } from "@/container/types.js";
import {
  branchCreateRequestSchema,
  type BranchCreateRequest,
} from "@common/dto/branch-create-request.js";
import { AbstractProcessorService } from "./abstract-processor-service.js";
import { parseDate } from "../utils/date.js";
import { Collection } from "@/domain/enum/collection.js";

@injectable()
export class BranchProcessorService extends AbstractProcessorService<
  BranchCsvRow,
  BranchCreateRequest
> {
  constructor(
    @inject(Type.BranchRepository)
    private readonly branchRepository: BranchRepository
  ) {
    super();
  }

  protected collection = Collection.Enterprise;

  protected headers = ["Id", "StartDate", "EnterpriseNumber"];

  protected override batchSize = 10_000;

  protected batchAction = async (batch: BranchCreateRequest[]) => {
    await this.branchRepository.bulkUpsert(batch);
  };

  protected tranform(row: BranchCsvRow): BranchCreateRequest {
    return {
      branchNumber: row.Id,
      startDate: parseDate(row.StartDate),
      enterpriseNumber: row.EnterpriseNumber,
    };
  }

  protected validate(row: BranchCreateRequest): boolean {
    return branchCreateRequestSchema.safeParse(row).success;
  }
}
