import type { ProcessorError } from "./processor-error.js";

export interface ProcessorResult {
  successCount: number;
  errors: ProcessorError[];
}
