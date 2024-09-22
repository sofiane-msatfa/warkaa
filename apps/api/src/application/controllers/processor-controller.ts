import { inject, injectable } from "inversify";
import { Type } from "@/container/types.js";
import { asyncHandler } from "@/application/utils/async-handler.js";
import { extractEnumValues } from "@/application/utils/enum.js";
import { UploadFieldName } from "@common/enum/upload-field-name.js";
import { MessengerQueue } from "@/domain/enum/messenger-queue.js";
import { HttpCode } from "@/domain/enum/http-code.js";
import { Collection } from "@/domain/enum/collection.js";
import type { MessengerApi } from "@/domain/gateway/messenger-api.js";
import type { ProcessDocumentBatchMessage } from "@/domain/internal/process-document-batch-message.js";

interface MulterFileDictionary {
  [fieldName: string]: Express.Multer.File[];
}

@injectable()
export class ProcessorController {
  constructor(
    @inject(Type.MessengerApi)
    private readonly messengerApi: MessengerApi
  ) {}

  public sendAllDocumentToProcessQueue = asyncHandler(async (req, res) => {
    const files = req.files as MulterFileDictionary | undefined;

    if (files === undefined) {
      return res.status(HttpCode.BAD_REQUEST).send("No files were uploaded.");
    }

    const processDocumentQueueMessage =
      this.buildProcessDocumentQueueMessage(files);

    await this.messengerApi.publish(
      MessengerQueue.Processor,
      JSON.stringify(processDocumentQueueMessage)
    );

    return res.status(HttpCode.OK).send("All documents sent to process queue.");
  });

  private buildProcessDocumentQueueMessage(files: MulterFileDictionary) {
    const processDocumentBatchMessage: ProcessDocumentBatchMessage = {};

    extractEnumValues(UploadFieldName).forEach((fieldName) => {
      const collection = this.getUploadFieldNameCollection(fieldName);
      const file = files[fieldName]?.[0];
      if (file) {
        processDocumentBatchMessage[collection] = {
          mimetype: file.mimetype,
          originalName: file.originalname,
          path: file.path,
          size: file.size,
        };
      }
    });

    return processDocumentBatchMessage;
  }

  private getUploadFieldNameCollection(fieldName: UploadFieldName): Collection {
    switch (fieldName) {
      case UploadFieldName.Enterprise:
        return Collection.Enterprise;
      case UploadFieldName.Branch:
        return Collection.Branch;
      case UploadFieldName.Establishment:
        return Collection.Establishment;
      case UploadFieldName.Contact:
        return Collection.Contact;
      case UploadFieldName.Address:
        return Collection.Address;
      case UploadFieldName.Activity:
        return Collection.Activity;
      case UploadFieldName.Denomination:
        return Collection.Denomination;
    }
  }
}
