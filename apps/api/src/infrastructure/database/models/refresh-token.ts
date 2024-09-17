import type { Types, Document } from "mongoose";
import { Schema, SchemaTypes, model } from "mongoose";
import { Collection } from "@/domain/enum/collection.js";

interface RefreshTokenDocument extends Document {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const refreshTokenSchema = new Schema<RefreshTokenDocument>({
  userId: { type: SchemaTypes.ObjectId, ref: Collection.User, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const RefreshToken = model<RefreshTokenDocument>(Collection.Tokens, refreshTokenSchema);

export default RefreshToken;
