import { ErrorType } from "@/domain/enum/error-type.js";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";

interface DefineHandlerParams<
  Params extends z.Schema,
  Query extends z.Schema,
  Body extends z.Schema
> {
  schema?: Partial<{
    params: Params;
    query: Query;
    body: Body;
  }>;
  onValidationError?: (res: Response, error: z.ZodError) => void;
  handler: RequestHandler<
    z.infer<Params>,
    any,
    z.infer<Body>,
    z.infer<Query>,
    Record<string, any>
  >;
}

function defaultOnValidationError(res: Response, error: z.ZodError) {
  const fieldErrors = error.flatten().fieldErrors;
  const errors = Object.values(fieldErrors).flat().filter(Boolean);
  res.status(400).json({
    error: ErrorType.ValidationError,
    details: errors,
  });
}

export function defineHandler<
  Params extends z.Schema,
  Query extends z.Schema,
  Body extends z.Schema
>(params: DefineHandlerParams<Params, Query, Body> | RequestHandler) {
  if (typeof params === "function") {
    return params;
  }

  const {
    schema = {},
    onValidationError = defaultOnValidationError,
    handler,
  } = params;

  return async (req: Request, res: Response, next: NextFunction) => {
    for (const [key, value] of Object.entries(schema)) {
      // @ts-ignore flemme de typer
      const result = value.safeParse(req[key]);
      if (!result.success) {
        onValidationError(res, result.error);
        return next();
      }
    }
  };
}
