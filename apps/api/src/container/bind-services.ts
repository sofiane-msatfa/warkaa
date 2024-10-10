import { bindIdentifier, bindIdentifierNamed } from "./container.js";
import { Type } from "./types.js";

import type { AuthService } from "@/domain/usecase/auth-service.js";
import { AuthConcreteService } from "@/application/services/auth-concrete-service.js";
import type { CsvProcessorService } from "@/domain/usecase/csv-processor-service.js";
import { BranchProcessorService } from "@/application/services/branch-processor-service.js";
import { ServiceTag } from "@/domain/enum/service-tag.js";
import { EnterpriseProcessorService } from "@/application/services/enterprise-processor-service.js";
import { EstablishmentProcessorService } from "@/application/services/establishment-processor-service.js";
import { ProcessorSubscriptionConcreteService } from "@/application/services/processor-subscription-concrete-service.js";
import type { ProcessorSubscriptionService } from "@/domain/usecase/processor-subscription-service.js";
import { ContactProcessorService } from "@/application/services/contact-processor-service.js";
import { AddressProcessorService } from "@/application/services/address-processor-service.js";
import { ActivityProcessorService } from "@/application/services/activity-processor-service.js";
import { DenominationProcessorService } from "@/application/services/denomination-processor-service.js";

export function bindServices() {
  bindIdentifier<AuthService>(Type.AuthService, AuthConcreteService);

  bindIdentifier<ProcessorSubscriptionService>(
    Type.ProcessorSubscriptionService,
    ProcessorSubscriptionConcreteService
  );

  bindIdentifierNamed<CsvProcessorService>(
    Type.CsvProcessorService,
    BranchProcessorService,
    ServiceTag.Branch
  );

  bindIdentifierNamed<CsvProcessorService>(
    Type.CsvProcessorService,
    EnterpriseProcessorService,
    ServiceTag.Enterprise
  );

  bindIdentifierNamed<CsvProcessorService>(
    Type.CsvProcessorService,
    EstablishmentProcessorService,
    ServiceTag.Establishment
  );

  bindIdentifierNamed<CsvProcessorService>(
    Type.CsvProcessorService,
    ContactProcessorService,
    ServiceTag.Contact
  );

  bindIdentifierNamed<CsvProcessorService>(
    Type.CsvProcessorService,
    AddressProcessorService,
    ServiceTag.Address
  );

  bindIdentifierNamed<CsvProcessorService>(
    Type.CsvProcessorService,
    ActivityProcessorService,
    ServiceTag.Activity
  );

  bindIdentifierNamed<CsvProcessorService>(
    Type.CsvProcessorService,
    DenominationProcessorService,
    ServiceTag.Denomination
  );
}
