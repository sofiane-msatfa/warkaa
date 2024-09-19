import type { ProcessorErrorType } from "../enum/processor-error-type.js";

export interface ProcessorError {
  type: ProcessorErrorType;
  message: string;
}