import type { AsyncResult } from "@/application/types/async-result.js";
import type { AuthenticationErrorType } from "../enum/authentication-error-type.js";
import type { AuthTokens } from "../entity/auth-tokens.js";
import type { LoginRequest } from "@common/dto/login-request.js";
import type { RegisterRequest } from "@common/dto/register-request.js";

export interface AuthService {
  login(
    credentials: LoginRequest
  ): AsyncResult<AuthTokens, AuthenticationErrorType>;
  register(
    data: RegisterRequest
  ): AsyncResult<boolean, AuthenticationErrorType>;
  refreshAuthTokens(
    refreshToken: string
  ): AsyncResult<AuthTokens, AuthenticationErrorType>;
  logout(refreshToken: string): Promise<void>;
}
