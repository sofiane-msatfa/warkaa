import type { Document } from "mongoose";
import { Schema } from "mongoose";

// "EntityNumber","ActivityGroup","NaceVersion","NaceCode","Classification"
//"0200.065.765","006","2008","84130","MAIN"
export interface ActivityDocument extends Document {
  activityGroup: string;
  naceVersion: string;
  naceCode: string;
  classification: string;
}

export const ActivitySchema = new Schema<ActivityDocument>({
  activityGroup: String,
  naceVersion: String,
  naceCode: String,
  classification: String,
});
