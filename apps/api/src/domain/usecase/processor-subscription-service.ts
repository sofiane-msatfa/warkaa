import type { ProcessDocumentBatchMessage } from "@/domain/internal/process-document-batch-message.js";
import type { ProcessorResultAggregate } from "../internal/processor-result-aggregate.js";

export interface ProcessorSubscriptionService {
  processDocumentBatch(
    message: ProcessDocumentBatchMessage
  ): Promise<ProcessorResultAggregate>;
}
