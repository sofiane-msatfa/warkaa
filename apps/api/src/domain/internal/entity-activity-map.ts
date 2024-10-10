import type { ActivityDocument } from "@/infrastructure/database/models/activity.js";
import type { Schema } from "mongoose";

export interface EntityActivityMapValue {
  _id: Schema.Types.ObjectId;
  activities: ActivityDocument[];
}

export type EntityActivityMap = Map<string, EntityActivityMapValue>;
