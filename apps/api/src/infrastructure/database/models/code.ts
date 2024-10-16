import type { Document } from "mongoose";
import { model, Schema } from "mongoose";
import { Collection } from "@/domain/enum/collection.js";

// "Category","Code","Language","Description"
// "ActivityGroup","001","FR","Activités TVA"
export interface CodeDocument extends Document {
  category: string;
  code: string;
  language: Date;
  description: string;
}

const CodeSchema = new Schema<CodeDocument>({
  category: { type: String, required: true },
  code: String,
  language: Date,
  description: String,
});

const CodeModel = model<CodeDocument>(Collection.Code, CodeSchema);

export default CodeModel;
