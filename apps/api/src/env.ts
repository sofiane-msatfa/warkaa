import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const STRING = z.string().min(1);
const NUMBER = z.coerce.number();
const BOOLEAN = z.enum(["true", "false"]).transform((s) => s === "true");

export const env = createEnv({
  server: {
    PORT: NUMBER.int().default(3000),
    MONGODB_URI: STRING.url(),
    ENABLE_SWAGGER: BOOLEAN.default("false"),
    FRONTEND_URL: STRING.url().default("http://10.0.0.2:5173"),
    ACCESS_TOKEN_SECRET: STRING,
    REFRESH_TOKEN_SECRET: STRING,
    REFRESH_TOKEN_EXPIRATION_IN_MS: NUMBER.int().default(
      1000 * 60 * 60 * 24 * 7
    ), // 7 days
    RABBITMQ_HOST: STRING.default("localhost"),
    RABBITMQ_USER: STRING.default("guest"),
    RABBITMQ_PASSWORD: STRING.default("guest"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
