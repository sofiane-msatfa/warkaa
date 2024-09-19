import type { MessengerApi } from "@/domain/gateway/messenger-api.js";
import type { MessengerSubscriptionCallback } from "@/domain/internal/messenger-subscription-callback.js";
import { TimeoutError, withTimeout } from "@/application/utils/timeout.js";
import { injectable } from "inversify";
import { env } from "@/env.js";
import amqplib from "amqplib";

@injectable() 
export class RabbitMQApi implements MessengerApi {
  public static CONNECTION_RETRY_DELAY = 5000;
  public static PUBLISH_RETRY_DELAY = 5000;
  public static instance: RabbitMQApi;
  private channel: amqplib.Channel | null = null;
  private connection: amqplib.Connection | null = null;
  private offlineQueue: Array<{ queue: string; message: string }> = [];
  private subscriptions: Map<string, MessengerSubscriptionCallback> = new Map();

  public static getInstance(): RabbitMQApi {
    if (!RabbitMQApi.instance) {
      RabbitMQApi.instance = new RabbitMQApi();
    }
    return RabbitMQApi.instance;
  }

  async getChannel(): Promise<amqplib.Channel> {
    if (this.channel) {
      return this.channel;
    }

    const connection = await this.waitForConnection();
    const channel = await connection.createChannel();
    this.channel = channel;

    return channel;
  }

  async subscribe(
    queue: string,
    callback: MessengerSubscriptionCallback
  ): Promise<void> {
    const channel = await this.getChannel();
    await channel.assertQueue(queue, { durable: true });

    if (this.subscriptions.has(queue)) {
      // on ne log rien ici car on serait spam lors d'une reconnexion
      return;
    }

    this.subscriptions.set(queue, callback);

    await channel.consume(queue, async (message) => {
      if (!message) return;

      try {
        await callback(message.content.toString());
        channel.ack(message);
      } catch (err) {
        console.error("[RabbitMQ] Message processing failed", err);
        // do not requeue message
        // @see https://www.rabbitmq.com/confirms.html
        channel.nack(message, false, false);
      }
    });
  }

  async unsubscribe(queue: string): Promise<void> {
    if (!this.subscriptions.has(queue)) {
      console.warn(`No subscription to ${queue}. Ignoring...`);
      return;
    }

    const channel = await this.getChannel();
    await channel.cancel(queue);
    this.subscriptions.delete(queue);
  }

  async publish(queue: string, message: string): Promise<void> {
    try {
      const channel = await this.getChannel();
      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(message), {
        persistent: true,
      });
    } catch (err) {
      console.error("[RabbitMQ] Publish failed", err);
      this.offlineQueue.push({ queue, message });
      setTimeout(this.publishOfflineQueue, RabbitMQApi.PUBLISH_RETRY_DELAY);
    }
  }

  private async publishOfflineQueue(): Promise<void> {
    const offlineQueue = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const { queue, message } of offlineQueue) {
      await this.publish(queue, message);
    }
  }

  async waitForConnection(): Promise<amqplib.Connection> {
    if (this.connection) {
      return this.connection;
    }

    const checkInterval = new Promise<amqplib.Connection>((resolve) => {
      const interval = setInterval(() => {
        if (this.connection) {
          clearInterval(interval);
          resolve(this.connection);
        }
      }, 100);
    });

    // timeout pour éviter une boucle infinie
    const connection = await withTimeout(
      checkInterval,
      RabbitMQApi.CONNECTION_RETRY_DELAY
    );

    if (connection instanceof TimeoutError) {
      throw new Error(
        "Connection timeout. Did you forget to call `RabbitMQApi.connect()`?"
      );
    }

    return connection;
  }

  async connect(): Promise<void> {
    if (this.connection) return;

    try {
      this.connection = await amqplib.connect({
        protocol: "amqp",
        hostname: env.RABBITMQ_HOST,
        username: env.RABBITMQ_USER,
        password: env.RABBITMQ_PASSWORD,
      });

      this.connection.on("close", () => {
        this.connection = null;
        setTimeout(this.connect, RabbitMQApi.CONNECTION_RETRY_DELAY);
      });

      this.connection.on("error", (err) => {
        console.error("[RabbitMQ] Connection error", err);
        this.connection = null;
        setTimeout(this.connect, RabbitMQApi.CONNECTION_RETRY_DELAY);
      });

      console.log("[RabbitMQ] Connection OK");
      this.channel = await this.connection.createChannel();
      await this.registerSubscriptions();
    } catch (err) {
      console.error("[RabbitMQ] Connection failed", err);
      setTimeout(this.connect, RabbitMQApi.CONNECTION_RETRY_DELAY);
    }
  }

  private async registerSubscriptions(): Promise<void> {
    for (const [queue, callback] of this.subscriptions) {
      await this.subscribe(queue, callback);
    }
  }
}
