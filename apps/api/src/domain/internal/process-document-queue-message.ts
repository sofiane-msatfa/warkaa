import type { UploadFieldName } from "@common/enum/upload-field-name.js";
import type { DocumentMetadata } from "./document-metadata.js";

export type ProcessDocumentQueueMessage = {
  [key in UploadFieldName]?: DocumentMetadata;
};
