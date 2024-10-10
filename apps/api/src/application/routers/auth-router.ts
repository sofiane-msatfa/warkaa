import { Router } from "express";
import { getInstance } from "@/container/container.js";
import { AuthController } from "../controllers/auth-controller.js";

// Route: /auth
export function authRouter(): Router {
  const router = Router();
  const controller = getInstance(AuthController);

  router.post("/auth/login", controller.login);
  router.post("/auth/register", controller.register);
  router.post("/auth/refresh", controller.refreshTokens);
  router.post("/auth/logout", controller.logout);

  return router;
}
