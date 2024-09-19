import { Router } from "express";
import { getInstance } from "@/container/container.js";
import { UserController } from "../controllers/user-controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

// Route: /users
export function userRouter(): Router {
  const router = Router();
  const controller = getInstance(UserController);

  router.get("/users", controller.getUsers);
  router.get("/users/me", isAuthenticated, controller.getCurrentUser);

  return router;
}
