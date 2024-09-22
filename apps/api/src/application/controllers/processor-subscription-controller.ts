import type { MessengerSubscriptionCallback } from "@/domain/internal/messenger-subscription-callback.js";
import type { ProcessDocumentBatchMessage } from "@/domain/internal/process-document-batch-message.js";
import type { ProcessorSubscriptionService } from "@/domain/usecase/processor-subscription-service.js";
import { injectable, inject } from "inversify";
import { Type } from "@/container/types.js";
import { performance } from "perf_hooks";

@injectable()
export class ProcessorSubscriptionController {
  constructor(
    @inject(Type.ProcessorSubscriptionService)
    private readonly processorSubscriptionService: ProcessorSubscriptionService
  ) {}

  public processDocumentBatch: MessengerSubscriptionCallback = async (
    message
  ) => {
    const processDocumentBatchMessage: ProcessDocumentBatchMessage =
      JSON.parse(message);

    const processorResultAggregate =
      await this.processorSubscriptionService.processDocumentBatch(
        processDocumentBatchMessage
      );

    // TODO send response via socket.io
    console.log({ processorResultAggregate });
  };
}
