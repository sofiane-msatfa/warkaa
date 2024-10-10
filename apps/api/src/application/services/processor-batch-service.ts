import type { ProcessorError } from "@/domain/internal/processor-error.js";
import type { BatchService } from "@/domain/usecase/batch-service.js";
import { ProcessorErrorType } from "@/domain/enum/processor-error-type.js";
import { MongooseError } from "mongoose";
import PQueue from "p-queue";

export class ProcessorBatchService<TRow>
  implements BatchService<TRow, ProcessorError>
{
  private batch: TRow[] = [];
  private errors: ProcessorError[] = [];
  private queue = new PQueue({ concurrency: 1 });
  private counter = 0;

  constructor(
    private size: number,
    private batchAction: (data: TRow[]) => Promise<void>
  ) {}

  public async add(data: TRow): Promise<void> {
    this.batch.push(data);
    if (this.batch.length >= this.size) {
      const currentBatch = [...this.batch];
      this.batch = [];
      this.queue.add(() => this.processBatch(currentBatch));
    }
  }

  public async flush(): Promise<void> {
    if (this.batch.length > 0) {
      const currentBatch = [...this.batch];
      this.batch = [];
      this.queue.add(() => this.processBatch(currentBatch));
    }

    await this.queue.onIdle();
  }

  public getErrors(): ProcessorError[] {
    return this.errors;
  }

  public getCount(): number {
    return this.counter;
  }

  private async processBatch(currentBatch: TRow[]): Promise<void> {
    try {
      this.counter++;
      await this.batchAction(currentBatch);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(err: unknown): void {
    console.log({ ctx: "BatchConcreteService", err });
    if (err instanceof MongooseError) {
      this.errors.push({
        type: ProcessorErrorType.MongooseError,
        message: err.message,
      });
    } else {
      this.errors.push({
        type: ProcessorErrorType.UnknownError,
        message: "Unknown error",
      });
    }
  }
}
