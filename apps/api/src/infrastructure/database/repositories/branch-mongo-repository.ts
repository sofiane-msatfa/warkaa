import { injectable } from "inversify";
import BranchModel from "../models/branch.js";
import type { BranchDocument } from "../models/branch.js";
import type { Branch } from "@/domain/entity/branch.js";
import type { BranchCreateRequest } from "@common/dto/branch-create-request.js";
import type { BranchRepository } from "@/domain/gateway/branch-repository.js";

@injectable()
export class BranchMongoRepository implements BranchRepository {
  async create(branch: BranchCreateRequest): Promise<Branch> {
    const newBranch = await BranchModel.create(branch);
    return this.toEntity(newBranch);
  }

  async upsert(branch: BranchCreateRequest): Promise<Branch> {
    const newBranch = await BranchModel.findOneAndUpdate(
      { id: branch.id },
      branch,
      { new: true, upsert: true }
    );
    return this.toEntity(newBranch);
  }

  async bulkUpsert(branches: BranchCreateRequest[]): Promise<void> {
    const operations = branches.map((branch) => ({
      updateOne: {
        filter: { id: branch.id },
        update: { $set: branch },
        upsert: true,
      },
    }));
    await BranchModel.bulkWrite(operations, { ordered: false });
  }

  async findById(id: string): Promise<Branch | null> {
    const branch = await BranchModel.findOne({ id });
    return branch ? this.toEntity(branch) : null;
  }

  async findAll(): Promise<Branch[]> {
    const branches = await BranchModel.find();
    return branches.map(this.toEntity);
  }

  private toEntity(branch: BranchDocument): Branch {
    return {
      id: branch.id,
      startDate: branch.startDate,
      enterpriseNumber: branch.enterpriseNumber,
      denomination: branch.denomination?.toString(),
      address: branch.address?.toString(),
      activity: branch.activity.map((activity) => activity.toString()),
      contact: branch.contact.map((contact) => contact.toString()),
      establishment: branch.establishment.map((establishment) =>
        establishment.toString()
      ),
    };
  }
}
