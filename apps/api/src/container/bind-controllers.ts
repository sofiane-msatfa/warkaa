import { AuthController } from "@/application/controllers/auth-controller.js";
import { bindSelf } from "./container.js";
import { UserController } from "@/application/controllers/user-controller.js";
import { UploadController } from "@/application/controllers/upload-controller.js";
import { ProcessorController } from "@/application/controllers/processor-controller.js";
import { ProcessorSubscriptionController } from "@/application/controllers/processor-subscription-controller.js";
import { BranchController } from "@/application/controllers/branch-controller.js";

export function bindControllers() {
  bindSelf(AuthController);
  bindSelf(UserController);
  bindSelf(UploadController);
  bindSelf(ProcessorController);
  bindSelf(ProcessorSubscriptionController);
  bindSelf(BranchController);
}
