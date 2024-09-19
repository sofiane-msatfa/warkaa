import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { bindDependencies } from "@/container/bind-dependencies.js";
import { registerRouters } from "./routers/register-routers.js";
import { registerQueues } from "./queues/register-queues.js";
import { env } from "@/env.js";

export async function createExpressApp(): Promise<express.Express> {
  const app = express();

  bindDependencies();
  expressConfigMiddleware(app);

  await registerQueues();
  registerRouters(app);

  return app;
}

function expressConfigMiddleware(app: express.Express): void {
  app.use(express.json({}));
  app.use(cookieParser());
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.disable("x-powered-by");

  app.use(
    cors({
      origin: ["http://localhost:5173", env.FRONTEND_URL],
      credentials: true,
      allowedHeaders: ["Content-Type", "Accept", "Authorization"],
    })
  );
}
