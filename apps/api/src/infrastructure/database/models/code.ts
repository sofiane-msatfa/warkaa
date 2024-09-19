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
  code: { type: String, required: false },
  language: { type: Date, required: false },
  description: { type: String, required: false },
});

const CodeModel = model<CodeDocument>(Collection.Code, CodeSchema);

export default CodeModel;
