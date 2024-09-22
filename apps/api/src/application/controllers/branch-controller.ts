import { Type } from "@/container/types.js";
import type { BranchRepository } from "@/domain/gateway/branch-repository.js";
import { inject, injectable } from "inversify";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpCode } from "@/domain/enum/http-code.js";

@injectable()
export class BranchController {
  constructor(
    @inject(Type.BranchRepository)
    private readonly branchRepository: BranchRepository
  ) {}

  public findOne = asyncHandler(async (req, res) => {
    const id = req.params.id as string;

    const branch = await this.branchRepository.findById(id);

    if (branch.isNone()) {
      res.status(HttpCode.NOT_FOUND).send();
      return;
    }

    res.json(branch.unwrap());
  });
}
