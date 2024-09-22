import type { ProcessorResult } from "../internal/processor-result.js";

export interface CsvProcessorService {
  parse(): NodeJS.WritableStream;
  process(filePath: string): Promise<ProcessorResult>;
}
