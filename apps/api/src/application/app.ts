import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { bindDependencies } from "@/container/bind-dependencies.js";
import { registerRouters } from "./routers/register-routers.js";

export function createExpressApp(): express.Express {
  const app = express();
  bindDependencies();
  expressConfigMiddleware(app);
  registerRouters(app);
  return app;
}

function expressConfigMiddleware(app: express.Express): void {
  app.use(express.json({ limit: "50mb" }));
  app.use(cookieParser());
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.disable("x-powered-by");

  app.use(
    cors({
      origin: ["http://localhost:5173"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Accept", "Authorization"],
    })
  );
}
