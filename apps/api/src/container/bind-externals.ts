import { bindIdentifier } from "./container.js";
import { Type } from "./types.js";

import type { BranchRepository } from "@/domain/gateway/branch-repository.js";
import type { UserRepository } from "@/domain/gateway/user-repository.js";
import { UserMongoRepository } from "@/infrastructure/database/repositories/user-mongo-repository.js";
import { BranchMongoRepository } from "@/infrastructure/database/repositories/branch-mongo-repository.js";
import type { MessengerApi } from "@/domain/gateway/messenger-api.js";
import { RabbitMQApi } from "@/infrastructure/api/rabbitmq-api.js";

export function bindExternals() {
  // repositories
  bindIdentifier<UserRepository>(Type.UserRepository, UserMongoRepository);
  bindIdentifier<BranchRepository>(
    Type.BranchRepository,
    BranchMongoRepository
  );

  // apis
  bindIdentifier<MessengerApi>(Type.MessengerApi, RabbitMQApi);
}
