import type { Response, RequestHandler } from "express";
import { ErrorType } from "@/domain/enum/error-type.js";
import { HttpCode } from "@/domain/enum/http-code.js";
import { z } from "zod";
import { asyncHandler } from "./async-handler.js";

type TypedRequestHandler<Params, Query, Body> = RequestHandler<
  Params,
  any,
  Body,
  Query,
  Record<string, any>
>;

interface DefineHandlerParams<
  Params extends z.Schema,
  Query extends z.Schema,
  Body extends z.Schema
> {
  schema: Partial<{
    params: Params;
    query: Query;
    body: Body;
  }>;
  onValidationError?: (res: Response, error: z.ZodError) => void;
  handler: TypedRequestHandler<z.infer<Params>, z.infer<Query>, z.infer<Body>>;
}

function defaultOnValidationError(res: Response, error: z.ZodError) {
  const fieldErrors = error.flatten().fieldErrors;
  res.status(HttpCode.BAD_REQUEST).json({
    error: ErrorType.ValidationError,
    details: fieldErrors,
  });
}

// @SOFIANE ajouter parsing headers
export function validationHandler<
  Params extends z.Schema,
  Query extends z.Schema,
  Body extends z.Schema
>(params: DefineHandlerParams<Params, Query, Body>): RequestHandler {
  if (typeof params === "function") {
    return params;
  }

  const {
    schema = {},
    onValidationError = defaultOnValidationError,
    handler,
  } = params;

  return asyncHandler(async (req, res, next) => {
    for (const [key, value] of Object.entries(schema)) {
      // @ts-ignore
      const result = value.safeParse(req[key]);
      if (!result.success) {
        onValidationError(res, result.error);
        return next();
      }
    }

    await handler(req, res, next);
    next();
  });
}
