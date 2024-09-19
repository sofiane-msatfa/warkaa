import { bindIdentifier, bindIdentifierNamed, bindSelf } from "./container.js";
import { Type } from "./types.js";

import type { AuthService } from "@/domain/usecase/auth-service.js";
import { AuthConcreteService } from "@/application/services/auth-concrete-service.js";
import type { CsvProcessorService } from "@/domain/usecase/csv-processor-service.js";
import { BranchProcessorService } from "@/application/services/branch-processor-service.js";
import { ServiceTag } from "@/domain/enum/service-tag.js";

export function bindServices() {
  bindIdentifier<AuthService>(Type.AuthService, AuthConcreteService);

  bindIdentifierNamed<CsvProcessorService>(
    Type.CsvProcessorService,
    BranchProcessorService,
    ServiceTag.Branch
  );
}
