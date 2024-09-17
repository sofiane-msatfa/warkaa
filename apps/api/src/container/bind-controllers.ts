import { AuthController } from "@/application/controllers/auth-controller.js";
import { bindSelf } from "./container.js";
import { UserController } from "@/application/controllers/user-controller.js";

export function bindControllers() {
  bindSelf(AuthController);
  bindSelf(UserController);
}
