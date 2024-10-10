import type { ContactDocument } from "@/infrastructure/database/models/contact.js";
import type { Schema } from "mongoose";

export interface EntityContactMapValue {
  _id: Schema.Types.ObjectId;
  contacts: ContactDocument[];
}

export type EntityContactMap = Map<string, EntityContactMapValue>;
