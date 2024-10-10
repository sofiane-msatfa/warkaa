import type { DocumentMetadata } from "./document-metadata.js";
import type { Collection } from "../enum/collection.js";

export type ProcessDocumentBatchMessage = {
  [key in Collection]?: DocumentMetadata;
};
