import type { RequestHandler } from "express";

export function asyncHandler(handler: RequestHandler): RequestHandler {
  return (req, res, next) => {
    return Promise.resolve(handler(req, res, next)).catch(next);
  };
}
