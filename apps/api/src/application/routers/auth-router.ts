import { Router } from "express";
import { getInstance } from "@/container/container.js";
import { AuthController } from "../controllers/auth-controller.js";

// Route: /auth
export function authRouter(): Router {
  const router = Router();
  const controller = getInstance(AuthController);

  router.post("/login", controller.login);
  router.post("/register", controller.register);
  router.post("/refresh", controller.refreshTokens);
  router.post("/logout", controller.logout);

  return router;
}
