import type { UserLight } from "@common/dto/user-light.js";
import type { Request } from "express";

export const LIGHT_USER_HEADER_NAME = "light-user";

export function getUserLightFromRequest(request: Request): UserLight {
  const serializedUser = request.headers[LIGHT_USER_HEADER_NAME] as string;
  return JSON.parse(serializedUser);
}
