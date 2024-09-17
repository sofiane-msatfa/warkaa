import type { RequestHandler } from "express";
import { HttpCode } from "@/domain/enum/http-code.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { LIGHT_USER_HEADER_NAME } from "../utils/auth.js";
import { AuthenticationErrorType } from "@/domain/enum/authentication-error-type.js";

export const isAuthenticated: RequestHandler = (req, res, next) => {
  const identifier = "Bearer ";
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(HttpCode.UNAUTHORIZED).send(AuthenticationErrorType.AuthorizationNotFound);
  }

  if (!authorization.startsWith(identifier)) {
    return res.status(HttpCode.UNAUTHORIZED).send(AuthenticationErrorType.UnsupportedIdentifier);
  }

  const token = authorization.slice(identifier.length);
  const result = verifyAccessToken(token);

  if (result.isErr()) {
    const errorType = result.unwrapErr();
    return res.status(HttpCode.UNAUTHORIZED).send(errorType);
  }

  req.headers[LIGHT_USER_HEADER_NAME] = JSON.stringify(result.unwrap());

  return next();
};
