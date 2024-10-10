interface DocumentMetadata {
  filename: string;
  encoding: string;
  mimeType: string;
}

interface InvalidDocumentMetadata extends DocumentMetadata {
  field: string;
  reason: string;
}

export interface UploadResponse {
  validFiles: DocumentMetadata[];
  invalidFiles: InvalidDocumentMetadata[];
}
