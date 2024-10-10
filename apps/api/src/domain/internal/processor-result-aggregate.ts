import type { ProcessorResult } from "./processor-result.js";
import type { Collection } from "../enum/collection.js";

export type ProcessorResultAggregate = {
  [key in Collection]?: ProcessorResult;
};
