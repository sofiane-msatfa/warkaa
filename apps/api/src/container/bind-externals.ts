import { bindIdentifier } from "./container.js";
import { Type } from "./types.js";

import type { BranchRepository } from "@/domain/gateway/branch-repository.js";
import type { UserRepository } from "@/domain/gateway/user-repository.js";
import { UserMongoRepository } from "@/infrastructure/database/repositories/user-mongo-repository.js";
import { BranchMongoRepository } from "@/infrastructure/database/repositories/branch-mongo-repository.js";
import type { MessengerApi } from "@/domain/gateway/messenger-api.js";
import { RabbitMQApi } from "@/infrastructure/api/rabbitmq-api.js";
import type { EnterpriseRepository } from "@/domain/gateway/enterprise-repository.js";
import { EnterpriseMongoRepository } from "@/infrastructure/database/repositories/enterprise-mongo-repository.js";
import type { EstablishmentRepository } from "@/domain/gateway/establishment-repository.js";
import { EstablishmentMongoRepository } from "@/infrastructure/database/repositories/establishment-mongo-respository.js";

export function bindExternals() {
  // repositories
  bindIdentifier<UserRepository>(Type.UserRepository, UserMongoRepository);
  bindIdentifier<BranchRepository>(
    Type.BranchRepository,
    BranchMongoRepository
  );
  bindIdentifier<EnterpriseRepository>(
    Type.EnterpriseRepository,
    EnterpriseMongoRepository
  );
  bindIdentifier<EstablishmentRepository>(
    Type.EstablishmentRepository,
    EstablishmentMongoRepository
  );

  // apis
  bindIdentifier<MessengerApi>(Type.MessengerApi, RabbitMQApi);
}
