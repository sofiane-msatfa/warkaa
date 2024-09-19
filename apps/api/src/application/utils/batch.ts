import { ProcessorErrorType } from "@/domain/enum/processor-error-type.js";
import type { ProcessorError } from "@/domain/internal/processor-error.js";
import { MongooseError } from "mongoose";
import type { Readable } from "stream";

export interface Batch<TRow> {
  errors: ProcessorError[];
  batch: TRow[];
  add(row: TRow): Promise<void>;
  flush(): Promise<void>;
}

export type BatchAction<TRow> = (batch: TRow[]) => Promise<void>;

export function createBatch<TRow>(
  stream: Readable,
  size: number,
  action: BatchAction<TRow>
): Batch<TRow> {
  const batch: TRow[] = [];
  const errors: ProcessorError[] = [];
  return {
    errors,
    batch,
    add: async (row: TRow) => {
      batch.push(row);
      if (batch.length === size) {
        stream.pause();
        try {
          await action(batch);
        } catch (err) {
          if (err instanceof MongooseError) {
            errors.push({
              type: ProcessorErrorType.MongooseError,
              message: err.message,
            });
            return;
          }

          errors.push({
            type: ProcessorErrorType.UnknownError,
            message: "Unknown error",
          });
        } finally {
          batch.length = 0;
          stream.resume();
        }
      }
    },
    flush: async () => {
      if (batch.length > 0) {
        await action(batch);
      }
    },
  };
}
