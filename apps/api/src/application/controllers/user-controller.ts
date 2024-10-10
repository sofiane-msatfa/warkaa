import { inject, injectable } from "inversify";
import { Type } from "@/container/types.js";
import { HttpCode } from "@/domain/enum/http-code.js";
import { getUserLightFromRequest } from "../utils/auth.js";
import type { UserRepository } from "@/domain/gateway/user-repository.js";
import { asyncHandler } from "../utils/async-handler.js";

@injectable()
export class UserController {
  constructor(
    @inject(Type.UserRepository) private readonly userRepository: UserRepository
  ) {}

  public getUsers = asyncHandler(async (req, res) => {
    const users = await this.userRepository.findAll();
    res.status(HttpCode.OK).json(users);
  });

  public getCurrentUser = asyncHandler((req, res) => {
    const currentUser = getUserLightFromRequest(req);
    res.status(HttpCode.OK).json(currentUser);
  });
}
