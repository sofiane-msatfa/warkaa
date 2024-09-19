import type { MessengerSubscriptionCallback } from "@/domain/internal/messenger-subscription-callback.js";

export interface MessengerApi {
  connect: () => Promise<void>;
  publish: (channel: string, message: string) => Promise<void>;
  subscribe: (
    channel: string,
    callback: MessengerSubscriptionCallback
  ) => Promise<void>;
  unsubscribe(queue: string): Promise<void>;
}
