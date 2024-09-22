import type { CsvProcessorService } from "@/domain/usecase/csv-processor-service.js";
import type { ProcessorError } from "@/domain/internal/processor-error.js";
import type { ProcessorResult } from "@/domain/internal/processor-result.js";
import type { Collection } from "@/domain/enum/collection.js";
import fs from "fs";
import csv from "fast-csv";
import { injectable } from "inversify";
import { ProcessorErrorType } from "@/domain/enum/processor-error-type.js";
import { pipeline } from "stream";
import { ProcessorBatchService } from "./processor-batch-service.js";
import { TimeoutError, withTimeout } from "../utils/timeout.js";

@injectable()
export abstract class AbstractProcessorService<
  TRow extends csv.ParserRow,
  TCreateRequest extends csv.ParserRow
> implements CsvProcessorService
{
  /** Renamed Headers of the CSV file */
  protected abstract headers: string[];

  /** Batch size before triggering batch action */
  protected batchSize: number = 1000;

  /** Convert row to create request */
  protected abstract tranform(row: TRow): TCreateRequest;

  /** Validate the create request */
  protected abstract validate(row: TCreateRequest): boolean;

  /** Collection to be processed (debug) */
  protected abstract collection: Collection;

  private validationResult: { valid: number; invalid: number } = {
    valid: 0,
    invalid: 0,
  };

  private errors: ProcessorError[] = [];
  private successCount = 0;

  /** Flag to check if processing is done */
  private done = false;

  protected abstract batchAction: (batch: TCreateRequest[]) => Promise<void>;

  public parse(): NodeJS.WritableStream {
    const batchService = new ProcessorBatchService<TCreateRequest>(
      this.batchSize,
      this.batchAction
    );

    const parserStream = csv
      .parse<TRow, TCreateRequest>({
        headers: this.headers,
        renameHeaders: true,
        ignoreEmpty: true,
      })
      .transform((row: TRow): TCreateRequest => this.tranform(row))
      .validate((row: TCreateRequest) => {
        const isValid = this.validate(row);
        this.validationResult[isValid ? "valid" : "invalid"]++;
        return isValid;
      });

    parserStream.on("data", async (row: TCreateRequest) => {
      await batchService.add(row);
    });

    parserStream.on("data-invalid", (_row, rowNumber) => {
      this.errors.push({
        type: ProcessorErrorType.InvalidRow,
        message: `Invalid row: ${rowNumber}`,
      });
    });

    parserStream.on("end", async (rowCount: number) => {
      this.successCount = rowCount;
      await batchService.flush();
      this.done = true;

      const batchErrors = batchService.getErrors();
      this.errors.push(...batchErrors);

      console.log({
        message: "Collection processing completed",
        collection: this.collection,
        validationResult: this.validationResult,
        batchCounter: batchService.getCount(),
        batchSize: this.batchSize,
      });
    });

    return parserStream;
  }

  public async process(filePath: string): Promise<ProcessorResult> {
    return new Promise((resolve) => {
      pipeline(fs.createReadStream(filePath), this.parse(), async (err) => {
        await this.waitForCompletion();
        await this.cleanup(filePath);

        if (err) {
          console.error({
            message: "Error processing collection",
            collection: this.collection,
            error: err,
          });

          this.errors.push({
            type: ProcessorErrorType.ParsingError,
            message: err.message,
          });

          resolve({ successCount: 0, errors: this.errors });
          return;
        }

        resolve({ successCount: this.successCount, errors: this.errors });
      });
    });
  }

  private async cleanup(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath);
      console.log({ message: "File deleted", filePath });
    } catch (err) {
      console.error({ message: "Error deleting file", filePath, error: err });
    }
  }
  
  private async waitForCompletion(): Promise<void> {
    if (this.done) {
      return Promise.resolve();
    }

    const checkInterval = new Promise<Boolean>((resolve) => {
      const interval = setInterval(() => {
        if (this.done) {
          clearInterval(interval);
          resolve(true);
        }
      }, 100);
    });

    const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
    const completion = await withTimeout(checkInterval, TIMEOUT_MS);

    if (completion instanceof TimeoutError) {
      throw new Error("Timeout waiting for completion");
    }
  }
}
