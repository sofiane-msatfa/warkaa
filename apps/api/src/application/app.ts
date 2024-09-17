import express from "express";

export function createExpressApp(): express.Application {
  const app = express();

  return app;
}
