import type { Types, Document } from "mongoose";
import { Schema, model } from "mongoose";
import { Collection } from "@/domain/enum/collection.js";

export interface UserDocument extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  deletedAt: Date | null;
}

const userSchema = new Schema<UserDocument>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = model<UserDocument>(Collection.User, userSchema);

export default User;
