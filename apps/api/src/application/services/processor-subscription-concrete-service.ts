import type { ProcessDocumentBatchMessage } from "@/domain/internal/process-document-batch-message.js";
import type { CsvProcessorService } from "@/domain/usecase/csv-processor-service.js";
import type { ProcessorSubscriptionService } from "@/domain/usecase/processor-subscription-service.js";
import type { AsyncOption } from "../types/async-option.js";
import type { ProcessorResult } from "@/domain/internal/processor-result.js";
import type { ProcessorResultAggregate } from "@/domain/internal/processor-result-aggregate.js";
import { Type } from "@/container/types.js";
import { ServiceTag } from "@/domain/enum/service-tag.js";
import { injectable, inject, named } from "inversify";
import { None, Some, type Option } from "@thames/monads";
import { Collection } from "@/domain/enum/collection.js";

@injectable()
export class ProcessorSubscriptionConcreteService
  implements ProcessorSubscriptionService
{
  constructor(
    @inject(Type.CsvProcessorService)
    @named(ServiceTag.Enterprise)
    private readonly enterpriseProcessorService: CsvProcessorService,

    @inject(Type.CsvProcessorService)
    @named(ServiceTag.Branch)
    private readonly branchProcessorService: CsvProcessorService,

    @inject(Type.CsvProcessorService)
    @named(ServiceTag.Establishment)
    private readonly establishmentProcessorService: CsvProcessorService,

    @inject(Type.CsvProcessorService)
    @named(ServiceTag.Contact)
    private readonly contactProcessorService: CsvProcessorService,

    @inject(Type.CsvProcessorService)
    @named(ServiceTag.Address)
    private readonly addressProcessorService: CsvProcessorService,

    @inject(Type.CsvProcessorService)
    @named(ServiceTag.Activity)
    private readonly activityProcessorService: CsvProcessorService,

    @inject(Type.CsvProcessorService)
    @named(ServiceTag.Denomination)
    private readonly denominationProcessorService: CsvProcessorService
  ) {}

  async processDocumentBatch(
    message: ProcessDocumentBatchMessage
  ): Promise<ProcessorResultAggregate> {
    const start = performance.now();

    const enterpriseProcessorResultOption =
      await this.executeDocumentProcessForCollection(
        message,
        Collection.Enterprise
      );

    const [branchProcessorResultOption, establishmentProcessorResultOption] =
      await Promise.all([
        this.executeDocumentProcessForCollection(message, Collection.Branch),
        this.executeDocumentProcessForCollection(
          message,
          Collection.Establishment
        ),
      ]);

    const [
      contactProcessorResultOption,
      addressProcessorResultOption,
      activityProcessorResultOption,
      denominationProcessorResultOption,
    ] = await Promise.all([
      this.executeDocumentProcessForCollection(message, Collection.Contact),
      this.executeDocumentProcessForCollection(message, Collection.Address),
      this.executeDocumentProcessForCollection(message, Collection.Activity),
      this.executeDocumentProcessForCollection(
        message,
        Collection.Denomination
      ),
    ]);

    console.log({
      ctx: "ProcessorSubscriptionConcreteService",
      message: "Processed all",
      time: performance.now() - start,
    });

    return this.buildProcessorResultAggregate({
      [Collection.Enterprise]: enterpriseProcessorResultOption,
      [Collection.Branch]: branchProcessorResultOption,
      [Collection.Establishment]: establishmentProcessorResultOption,
      [Collection.Contact]: contactProcessorResultOption,
      [Collection.Address]: addressProcessorResultOption,
      [Collection.Activity]: activityProcessorResultOption,
      [Collection.Denomination]: denominationProcessorResultOption,
    });
  }

  private async executeDocumentProcessForCollection(
    message: ProcessDocumentBatchMessage,
    collection: Collection
  ): AsyncOption<ProcessorResult> {
    const documentMetadata = message[collection];

    if (!documentMetadata) {
      return None;
    }

    const start = performance.now();
    const processorService = this.getProcessorService(collection);
    const result = await processorService.process(documentMetadata.path);

    console.log({
      ctx: "ProcessorSubscriptionConcreteService",
      message: "Collection processed",
      collection,
      time: performance.now() - start,
    });

    return Some(result);
  }

  private getProcessorService(collection: Collection): CsvProcessorService {
    switch (collection) {
      case Collection.Enterprise:
        return this.enterpriseProcessorService;
      case Collection.Branch:
        return this.branchProcessorService;
      case Collection.Establishment:
        return this.establishmentProcessorService;
      case Collection.Contact:
        return this.contactProcessorService;
      case Collection.Address:
        return this.addressProcessorService;
      case Collection.Activity:
        return this.activityProcessorService;
      case Collection.Denomination:
        return this.denominationProcessorService;
      default:
        throw new Error(
          `Processor service not found for collection: ${collection}`
        );
    }
  }

  private buildProcessorResultAggregate(
    results: Partial<Record<Collection, Option<ProcessorResult>>>
  ): ProcessorResultAggregate {
    const aggregate: ProcessorResultAggregate = {};

    for (const [collection, resultOption] of Object.entries(results)) {
      if (resultOption.isSome()) {
        aggregate[collection as Collection] = resultOption.unwrap();
      }
    }

    return aggregate;
  }
}
