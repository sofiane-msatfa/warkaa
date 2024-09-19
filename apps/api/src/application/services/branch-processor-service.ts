import { inject, injectable } from "inversify";
import { Type } from "@/container/types.js";
import type { BranchRow } from "@/domain/internal/branch-row.js";
import {
  branchCreateRequestSchema,
  type BranchCreateRequest,
} from "@common/dto/branch-create-request.js";
import type { BranchRepository } from "@/domain/gateway/branch-repository.js";
import { AbstractProcessorService } from "./abstract-processor-service.js";

@injectable()
export class BranchProcessorService extends AbstractProcessorService<
  BranchRow,
  BranchCreateRequest
> {
  constructor(
    @inject(Type.BranchRepository)
    private readonly branchRepository: BranchRepository
  ) {
    super();
  }

  protected headers = ["Id", "StartDate", "EnterpriseNumber"];

  protected batchAction(batch: BranchCreateRequest[]) {
    return this.branchRepository.bulkUpsert(batch);
  }

  protected tranform(row: BranchRow): BranchCreateRequest {
    return {
      id: row.Id,
      startDate: new Date(row.StartDate),
      enterpriseNumber: row.EnterpriseNumber,
    };
  }

  protected validate(row: BranchCreateRequest): boolean {
    return branchCreateRequestSchema.safeParse(row).success;
  }
}
