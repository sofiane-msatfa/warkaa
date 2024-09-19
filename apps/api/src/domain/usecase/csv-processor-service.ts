import type { AsyncResult } from "@/application/types/async-result.js";
import type { ProcessorError } from "@/domain/internal/processor-error.js";

export interface CsvProcessorService {
  parse(): NodeJS.WritableStream;
  process(filePath: string): AsyncResult<number, ProcessorError[]>;
}
