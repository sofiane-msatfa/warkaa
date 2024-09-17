import type { Express, ErrorRequestHandler } from "express";
import { HttpCode } from "@/domain/enum/http-code.js";
import { isAuthenticated } from "@/application/middlewares/auth.js";
import { getUserLightFromRequest } from "@/application/utils/auth.js";
import { userRouter } from "./user-router.js";
import { authRouter } from "./auth-router.js";

export function registerRouters(app: Express): void {
  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/", (req, res) => {
    res.json({ message: "Hello, World!" });
  });

  // routes
  app.use("/users", userRouter());
  app.use("/auth", authRouter());

  app.get("/protected", isAuthenticated, (req, res) => {
    const user = getUserLightFromRequest(req);
    res.json({ message: "Protected route", user });
  });

  app.use(errorHandler);
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res
    .status(HttpCode.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal Server Error" });
};
