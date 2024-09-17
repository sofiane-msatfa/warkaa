import { bindIdentifier } from "./container.js";
import { Type } from "./types.js";

import type { AuthService } from "@/domain/usecase/auth-service.js";
import { AuthConcreteService } from "@/application/services/auth-concrete-service.js";

export function bindServices() {
  bindIdentifier<AuthService>(Type.AuthService, AuthConcreteService);
}
