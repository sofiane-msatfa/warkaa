import { inject, injectable } from "inversify";
import { Type } from "@/container/types.js";
import { AbstractProcessorService } from "./abstract-processor-service.js";
import type { BranchRepository } from "@/domain/gateway/branch-repository.js";
import type { EnterpriseRepository } from "@/domain/gateway/enterprise-repository.js";
import type { EstablishmentRepository } from "@/domain/gateway/establishment-repository.js";
import {
  activityCreateRequestSchema,
  type ActivityCreateRequest,
} from "@common/dto/activity-create-request.js";
import type { ActivityCsvRow } from "@/domain/internal/activity-csv-row.js";
import { Collection } from "@/domain/enum/collection.js";

@injectable()
export class ActivityProcessorService extends AbstractProcessorService<
  ActivityCsvRow,
  ActivityCreateRequest
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

  // batch plus petit car on a 3 repositories à mettre à jour
  protected headers = [
    "EntityNumber",
    "ActivityGroup",
    "NaceVersion",
    "NaceCode",
    "Classification",
  ];

  protected batchAction = async (batch: ActivityCreateRequest[]) => {
    await Promise.all([
      this.branchRepository.bulkAddActivities(batch),
      this.enterpriseRepository.bulkAddActivities(batch),
      this.establishmentRepository.bulkAddActivities(batch),
    ]);
  };

  protected tranform(row: ActivityCsvRow): ActivityCreateRequest {
    return {
      entityNumber: row.EntityNumber,
      activityGroup: row.ActivityGroup,
      classification: row.Classification,
      naceCode: row.NaceCode,
      naceVersion: row.NaceVersion,
    };
  }

  protected validate(row: ActivityCreateRequest): boolean {
    return activityCreateRequestSchema.safeParse(row).success;
  }
}
