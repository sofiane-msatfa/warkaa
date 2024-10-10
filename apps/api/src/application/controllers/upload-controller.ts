import { injectable } from "inversify";
import multer from "multer";
import { UploadFieldName } from "@common/enum/upload-field-name.js";
import { extractEnumValues } from "../utils/enum.js";
import { createDiskStorageMulter } from "../utils/multer.js";
import { asyncHandler } from "../utils/async-handler.js";

@injectable()
export class UploadController {
  public uploadMultipleDocumentMiddleware = (mimeType: string[]) =>
    asyncHandler(async (req, res, next) => {
      const fields = extractEnumValues(UploadFieldName).map<multer.Field>(
        (fieldName) => ({
          name: fieldName,
          maxCount: 1,
        })
      );

      const multer = createDiskStorageMulter((_req, file, cb) => {
        if (!mimeType.includes(file.mimetype)) {
          return cb(null, false);
        }

        cb(null, true);
      });

      const upload = multer.fields(fields);

      upload(req, res, (err) => {
        if (err) {
          res.status(400).send(err.message);
          return;
        }

        next();
      });
    });
}
