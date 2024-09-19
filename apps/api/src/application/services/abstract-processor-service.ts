import fs from "fs";
import csv from "fast-csv";
import { injectable } from "inversify";
import { Err, Ok } from "@thames/monads";
import { createBatch } from "../utils/batch.js";
import { ProcessorErrorType } from "@/domain/enum/processor-error-type.js";
import type { CsvProcessorService } from "@/domain/usecase/csv-processor-service.js";
import type { AsyncResult } from "../types/async-result.js";
import type { ProcessorError } from "@/domain/internal/processor-error.js";

@injectable()
export abstract class AbstractProcessorService<
  TRow extends csv.ParserRow,
  TCreateRequest extends csv.ParserRow
> implements CsvProcessorService
{
  /** Renamed Headers of the CSV file */
  protected abstract headers: string[];

  /** Batch size before triggering batch action */
  protected batchSize = 1000;

  /** Convert row to create request */
  protected abstract tranform(row: TRow): TCreateRequest;

  /** Validate the create request */
  protected abstract validate(row: TCreateRequest): boolean;

  /** Batch action to be executed */
  protected abstract batchAction(batch: TCreateRequest[]): Promise<void>;

  public parse(): NodeJS.WritableStream {
    return csv
      .parse<TRow, TCreateRequest>({
        headers: this.headers,
        renameHeaders: true,
        ignoreEmpty: true,
      })
      .transform((row: TRow): TCreateRequest => this.tranform(row))
      .validate((row: TCreateRequest) => this.validate(row));
  }

  public process(filePath: string): AsyncResult<number, ProcessorError[]> {
    return new Promise((resolve) => {
      const errors: ProcessorError[] = [];
      const stream = fs.createReadStream(filePath);
      const parser = this.parse();

      const batch = createBatch<TCreateRequest>(
        stream,
        this.batchSize,
        this.batchAction
      );

      parser.on("data", async (row: TCreateRequest) => {
        await batch.add(row);
      });

      parser.on("data-invalid", (_row, rowNumber) => {
        errors.push({
          type: ProcessorErrorType.InvalidRow,
          message: `Invalid row: ${rowNumber}`,
        });
      });

      parser.on("error", (error) => {
        console.error(error);
        resolve(
          Err([{ type: ProcessorErrorType.ParsingError, message: error }])
        );
      });

      parser.on("end", async (rowCount: number) => {
        await batch.flush();
        await this.cleanup(filePath);

        errors.push(...batch.errors);

        if (errors.length > 0) {
          console.error(batch.errors);
          resolve(Err(errors));
        }

        resolve(Ok(rowCount));
      });

      stream.pipe(parser);
    });
  }

  private async cleanup(filePath: string): Promise<void> {
    return new Promise((resolve) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
        }
        resolve();
      });
    });
  }
}
