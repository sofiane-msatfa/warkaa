import { Router } from "express";
import { getInstance } from "@/container/container.js";
import { BranchController } from "../controllers/branch-controller.js";

export function branchRouter(): Router {
  const router = Router();
  const controller = getInstance(BranchController);

  router.get("/branch/:id", controller.findOne);

  return router;
}
