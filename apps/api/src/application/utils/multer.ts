import type { Request } from "express";
import type { FileFilterCallback } from "multer";
import multer from "multer";

export type MulterFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => void;

function createUniqueFileName(file: Express.Multer.File) {
  return `${file.fieldname}-${file.originalname}-${Date.now()}`;
}

export function createDiskStorageMulter(filter?: MulterFileFilter): multer.Multer {
  return multer({
    fileFilter: filter,
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "tmp/uploads/");
      },
      filename: (req, file, cb) => {
        cb(null, createUniqueFileName(file));
      },
    }),
  });
}
