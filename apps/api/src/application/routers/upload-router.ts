import { getInstance } from "@/container/container.js";
import { Router } from "express";
import { UploadController } from "../controllers/upload-controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { ProcessorController } from "../controllers/processor-controller.js";

// Route: /upload
export function uploadRouter(): Router {
  const router = Router();
  const uploadController = getInstance(UploadController);
  const processorController = getInstance(ProcessorController);

  router.post(
    "/upload/file",
    // isAuthenticated,
    uploadController.uploadMultipleDocumentMiddleware(["text/csv"]),
    processorController.sendAllDocumentToProcessQueue
  );

  return router;
}
