import type { AsyncResult } from "@/application/types/async-result.js";
import { ErrorType } from "@/domain/enum/error-type.js";
import { env } from "@/env.js";
import { Err, Ok } from "@thames/monads";
import mongoose from "mongoose";

export async function connectToMongoDb(): AsyncResult<
  mongoose.Mongoose,
  ErrorType
> {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI);
    return Ok(connection);
  } catch (err) {
    return Err(ErrorType.DatabaseConnectionError);
  }
}
