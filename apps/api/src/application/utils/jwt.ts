import type { UserLight } from "@common/dto/user-light.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { Err, Ok, type Result } from "@thames/monads";
import { env } from "@/env.js";
import { AuthenticationErrorType } from "@/domain/enum/authentication-error-type.js";

export function generateAccessToken(user: UserLight): string {
  const payload = { sub: JSON.stringify(user) };
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1800s", // 30 minutes
  });
}

export function generateRefreshToken(user: UserLight): string {
  const payload = { sub: JSON.stringify(user) };
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1y",
  });
}

function handleJwtError(err: unknown): AuthenticationErrorType {
  if (err instanceof jwt.TokenExpiredError) {
    return AuthenticationErrorType.TokenExpired;
  }

  return AuthenticationErrorType.Unauthorized;
}

export function verifyAccessToken(
  token: string
): Result<UserLight, AuthenticationErrorType> {
  try {
    const { sub } = jwt.verify(
      token,
      env.ACCESS_TOKEN_SECRET
    ) as Required<JwtPayload>;
    const userLight = JSON.parse(sub) as UserLight;
    return Ok(userLight);
  } catch (err) {
    const errorType = handleJwtError(err);
    return Err(errorType);
  }
}

export function verifyRefreshToken(
  token: string
): Result<UserLight, AuthenticationErrorType> {
  try {
    const { sub } = jwt.verify(
      token,
      env.REFRESH_TOKEN_SECRET
    ) as Required<JwtPayload>;
    const userLight = JSON.parse(sub) as UserLight;
    return Ok(userLight);
  } catch (err) {
    const errorType = handleJwtError(err);
    return Err(errorType);
  }
}
