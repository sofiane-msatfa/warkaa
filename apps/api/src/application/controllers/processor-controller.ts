import { inject, injectable } from "inversify";
import { Type } from "@/container/types.js";
import { asyncHandler } from "@/application/utils/async-handler.js";
import { extractEnumValues } from "@/application/utils/enum.js";
import { UploadFieldName } from "@common/enum/upload-field-name.js";
import { MessengerQueue } from "@/domain/enum/messenger-queue.js";
import { HttpCode } from "@/domain/enum/http-code.js";
import type { MessengerApi } from "@/domain/gateway/messenger-api.js";
import type { ProcessDocumentQueueMessage } from "@/domain/internal/process-document-queue-message.js";

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
    const processDocumentQueueMessage: ProcessDocumentQueueMessage = {};

    extractEnumValues(UploadFieldName).forEach((fieldName) => {
      const file = files[fieldName]?.[0];
      if (file) {
        processDocumentQueueMessage[fieldName] = {
          mimetype: file.mimetype,
          originalName: file.originalname,
          path: file.path,
          size: file.size,
        };
      }
    });

    return processDocumentQueueMessage;
  }
}
