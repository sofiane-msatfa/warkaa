import type { RequestHandler } from "express";
import { HttpCode } from "@/domain/enum/http-code.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { LIGHT_USER_HEADER_NAME } from "@/constants.js";
import { AuthenticationErrorType } from "@/domain/enum/authentication-error-type.js";

export const isAuthenticated: RequestHandler = (req, res, next) => {
  const TOKEN_PREFIX = "Bearer ";
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(HttpCode.UNAUTHORIZED).send(AuthenticationErrorType.AuthorizationNotFound);
  }

  if (!authorization.startsWith(TOKEN_PREFIX)) {
    return res.status(HttpCode.UNAUTHORIZED).send(AuthenticationErrorType.UnsupportedIdentifier);
  }

  const token = authorization.slice(TOKEN_PREFIX.length);
  const result = verifyAccessToken(token);

  if (result.isErr()) {
    const errorType = result.unwrapErr();
    return res.status(HttpCode.UNAUTHORIZED).send(errorType);
  }

  req.headers[LIGHT_USER_HEADER_NAME] = JSON.stringify(result.unwrap());

  return next();
};
