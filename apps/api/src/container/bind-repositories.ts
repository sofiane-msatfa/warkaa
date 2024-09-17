import { bindIdentifier } from "./container.js";
import { Type } from "./types.js";

import type { UserRepository } from "@/domain/gateway/user-repository.js";
import { UserMongoRepository } from "@/infrastructure/database/repositories/user-mongo-repository.js";

export function bindRepositories() {
  bindIdentifier<UserRepository>(Type.UserRepository, UserMongoRepository);
}
