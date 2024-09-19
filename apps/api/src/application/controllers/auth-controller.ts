import { inject, injectable } from "inversify";
import { Type } from "@/container/types.js";
import type { Response } from "express";
import { defineHandler } from "@/application/utils/define-handler.js";
import { loginRequestSchema } from "@common/dto/login-request.js";
import type { AuthService } from "@/domain/usecase/auth-service.js";
import { AuthenticationErrorType } from "@/domain/enum/authentication-error-type.js";
import { HttpCode } from "@/domain/enum/http-code.js";
import { registerRequestSchema } from "@common/dto/register-request.js";
import { env } from "@/env.js";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/constants.js";
import { z } from "zod";

// Define a schema for refreshToken
const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

@injectable()
export class AuthController {
  constructor(
    @inject(Type.AuthService) private readonly authService: AuthService
  ) {}

  public login = defineHandler({
    schema: {
      body: loginRequestSchema,
    },
    handler: async (req, res, next) => {
      const credentials = req.body;

      const authPayload = await this.authService.login(credentials);

      if (authPayload.isErr()) {
        const errorType = authPayload.unwrapErr();
        this.handleAuthenticationError(errorType, res);
        return next();
      }

      const { accessToken, refreshToken } = authPayload.unwrap();

      res.status(HttpCode.OK).json({ accessToken, refreshToken });
    },
  });

  public register = defineHandler({
    schema: {
      body: registerRequestSchema,
    },
    handler: async (req, res, next) => {
      const data = req.body;
      const authPayload = await this.authService.register(data);

      if (authPayload.isErr()) {
        const errorType = authPayload.unwrapErr();
        this.handleAuthenticationError(errorType, res);
        return next();
      }

      res.status(HttpCode.CREATED).send("User created");
    },
  });

  public refreshTokens = defineHandler({
    schema: {
      body: refreshTokenSchema,
    },
    handler: async (req, res, next) => {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(HttpCode.BAD_REQUEST).send("Refresh token not found");
      }

      const authPayload = await this.authService.refreshAuthTokens(refreshToken);

      if (authPayload.isErr()) {
        const errorType = authPayload.unwrapErr();
        this.handleAuthenticationError(errorType, res);
        return next();
      }

      const { accessToken, refreshToken: newRefreshToken } = authPayload.unwrap();

      res.status(HttpCode.OK).json({ accessToken, refreshToken: newRefreshToken });
    },
  });

  public logout = defineHandler({
    schema: {
      body: refreshTokenSchema,
    },
    handler: async (req, res) => {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        console.log("Refresh token not found");
        return res.status(HttpCode.BAD_REQUEST).send("Refresh token not found");
      }

      await this.authService.logout(refreshToken);

      res.status(HttpCode.OK).send("Logged out");
    },
  });

  private setRefreshTokenCookie = (
    res: Response,
    refreshToken: string
  ): void => {
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: env.REFRESH_TOKEN_EXPIRATION_IN_MS,
    });
  };

  private handleAuthenticationError = (
    error: AuthenticationErrorType,
    res: Response
  ): Response => {
    switch (error) {
      case AuthenticationErrorType.EmailAlreadyExists:
      case AuthenticationErrorType.AuthorizationNotFound:
      case AuthenticationErrorType.Unauthorized:
      case AuthenticationErrorType.UserNotFound:
      case AuthenticationErrorType.InvalidRefreshToken:
        // avoid leaking information about existing users
        // alternative: captcha on the frontend
        return res.status(HttpCode.UNAUTHORIZED).send("Unauthorized");
      case AuthenticationErrorType.UnsupportedIdentifier:
        return res.status(HttpCode.BAD_REQUEST).send("Unsupported identifier");
      case AuthenticationErrorType.UserCreationFailed:
        return res
          .status(HttpCode.INTERNAL_SERVER_ERROR)
          .send("User creation failed");
      case AuthenticationErrorType.TokenExpired:
        return res.status(HttpCode.UNAUTHORIZED).send("TokenExpired");
    }
  };
}