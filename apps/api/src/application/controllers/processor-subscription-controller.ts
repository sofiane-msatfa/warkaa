import { injectable, inject, named } from "inversify";
import { Type } from "@/container/types.js";
import { ServiceTag } from "@/domain/enum/service-tag.js";
import type { MessengerSubscriptionCallback } from "@/domain/internal/messenger-subscription-callback.js";
import type { CsvProcessorService } from "@/domain/usecase/csv-processor-service.js";
import type { ProcessDocumentQueueMessage } from "@/domain/internal/process-document-queue-message.js";

@injectable()
export class ProcessorSubscriptionController {
  constructor(
    @inject(Type.CsvProcessorService)
    @named(ServiceTag.Branch)
    private readonly branchProcessorService: CsvProcessorService
  ) {}

  public processAllDocuments: MessengerSubscriptionCallback = async (
    message
  ) => {
    const processDocumentQueueMessage: ProcessDocumentQueueMessage =
      JSON.parse(message);

    if (processDocumentQueueMessage.Branch) {
      const result = await this.branchProcessorService.process(
        processDocumentQueueMessage.Branch.path
      );

      if (result.isOk()) {
        console.log("Branch file processed successfully.");
        return;
      }

      console.error("Branch file processing failed.");
      console.error(result.unwrapErr().length);
    }
  };
}
