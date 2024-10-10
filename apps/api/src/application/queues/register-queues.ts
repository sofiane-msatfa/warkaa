import { getInstance } from "@/container/container.js";
import { Type } from "@/container/types.js";
import type { MessengerApi } from "@/domain/gateway/messenger-api.js";
import { processorQueue } from "./processor-queue.js";

export async function registerQueues(): Promise<void> {
  const messenger = getInstance<MessengerApi>(Type.MessengerApi);
  await messenger.connect();

  await Promise.all([processorQueue(messenger)]);
}
