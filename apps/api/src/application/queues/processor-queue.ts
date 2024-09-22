import { getInstance } from "@/container/container.js";
import { ProcessorSubscriptionController } from "@/application/controllers/processor-subscription-controller.js";
import { MessengerQueue } from "@/domain/enum/messenger-queue.js";
import type { MessengerApi } from "@/domain/gateway/messenger-api.js";

export async function processorQueue(messenger: MessengerApi): Promise<void> {
  const processorSubscriptionController = getInstance(
    ProcessorSubscriptionController
  );

  await messenger.subscribe(
    MessengerQueue.Processor,
    processorSubscriptionController.processDocumentBatch
  );
}
