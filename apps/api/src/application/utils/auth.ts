import { LIGHT_USER_HEADER_NAME } from "@/constants.js";
import type { UserLight } from "@common/dto/user-light.js";
import type { AnyRequest } from "../types/any-request.js";

export function getUserLightFromRequest(request: AnyRequest): UserLight {
  const serializedUser = request.headers[LIGHT_USER_HEADER_NAME] as string;
  return JSON.parse(serializedUser);
}
