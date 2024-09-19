import type { BranchCreateRequest } from "@common/dto/branch-create-request.js";
import type { Branch } from "@/domain/entity/branch.js";

export interface BranchRepository {
  create(branch: BranchCreateRequest): Promise<Branch>;
  upsert(branch: BranchCreateRequest): Promise<Branch>;
  bulkUpsert(branches: BranchCreateRequest[]): Promise<void>;
  findById(id: string): Promise<Branch | null>;
  findAll(): Promise<Branch[]>;
}
