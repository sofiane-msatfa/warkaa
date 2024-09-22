import { Schema } from "mongoose";

export function isObjectId(value: unknown): value is Schema.Types.ObjectId {
  return value instanceof Schema.Types.ObjectId;
}
