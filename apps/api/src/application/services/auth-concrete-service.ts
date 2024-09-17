import argon2 from "argon2";
import { inject, injectable } from "inversify";
import { Type } from "@/container/types.js";
import { performance } from "node:perf_hooks";
import { Err, Ok } from "@thames/monads";
import { stall } from "../utils/stall.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { AuthenticationErrorType } from "@/domain/enum/authentication-error-type.js";

import type { AuthService } from "@/domain/usecase/auth-service.js";
import type { AuthTokens } from "@/domain/entity/auth-tokens.js";
import type { LoginRequest } from "@common/dto/login-request.js";
import type { AsyncResult } from "../types/async-result.js";
import type { RegisterRequest } from "@common/dto/register-request.js";
import type { UserLight } from "@common/dto/user-light.js";
import type { UserRepository } from "@/domain/gateway/user-repository.js";
import type { User } from "@/domain/entity/user.js";

@injectable()
export class AuthConcreteService implements AuthService {
  constructor(
    @inject(Type.UserRepository) private readonly userRepository: UserRepository
  ) {}

  async login(
    credentials: LoginRequest
  ): AsyncResult<AuthTokens, AuthenticationErrorType> {
    const timeStart = performance.now();
    const stallTime = 1000;

    const user = await this.userRepository.findByEmail(credentials.email);

    if (!user) {
      await stall(stallTime, timeStart);
      return Err(AuthenticationErrorType.UserNotFound);
    }

    const passwordMatch = await argon2.verify(
      user.password,
      credentials.password
    );

    if (!passwordMatch) {
      await stall(stallTime, timeStart);
      return Err(AuthenticationErrorType.Unauthorized);
    }

    const userLight = this.toUserLight(user);
    const authtokens = await this.generateAuthTokens(userLight);

    await stall(stallTime, timeStart);
    return Ok(authtokens);
  }

  async register(
    data: RegisterRequest
  ): AsyncResult<boolean, AuthenticationErrorType> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      return Err(AuthenticationErrorType.EmailAlreadyExists);
    }

    const hashedPassword = await argon2.hash(data.password);
    const userToCreate = { ...data, password: hashedPassword };

    try {
      await this.userRepository.create(userToCreate);
      return Ok(true);
    } catch (err) {
      console.error(err);
      return Err(AuthenticationErrorType.UserCreationFailed);
    }
  }

  async refreshAuthTokens(
    refreshToken: string
  ): AsyncResult<AuthTokens, AuthenticationErrorType> {
    const result = verifyRefreshToken(refreshToken);

    if (result.isErr()) {
      const errorType = result.unwrapErr();

      if (errorType === AuthenticationErrorType.TokenExpired) {
        await this.userRepository.deleteRefreshToken(refreshToken);
      }

      return Err(errorType);
    }

    const userLight = result.unwrap();

    const storedToken = await this.userRepository.findRefreshToken(
      userLight.id,
      refreshToken
    );

    if (!storedToken) {
      return Err(AuthenticationErrorType.InvalidRefreshToken);
    }

    const authTokens = await this.generateAuthTokens(userLight);

    return Ok(authTokens);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.userRepository.deleteRefreshToken(refreshToken);
  }

  private async generateAuthTokens(user: UserLight): Promise<AuthTokens> {
    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);
    await this.userRepository.createRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  private toUserLight(user: User): UserLight {
    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      deletedAt: user.deletedAt,
    };
  }
}
