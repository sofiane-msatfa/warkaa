import type { AsyncResult } from "@/application/types/async-result.js";
import { ErrorType } from "@/domain/enum/error-type.js";
import { Err, Ok } from "@thames/monads";
import mongoose from "mongoose";

export async function connectToMongoDb(uri: string): AsyncResult<
  mongoose.Mongoose,
  ErrorType
> {
  try {
    const connection = await mongoose.connect(uri);
    return Ok(connection);
  } catch (err) {
    return Err(ErrorType.DatabaseConnectionError);
  }
}
