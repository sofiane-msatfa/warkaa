import type { Document } from "mongoose";
import { model, Schema } from "mongoose";
import { Collection } from "@/domain/enum/collection.js";

// "EntityNumber","Language","TypeOfDenomination","Denomination"
// "0200.065.765","2","001","Intergemeentelijke Vereniging Veneco"
export interface DenominationDocument extends Document {
  language: string;
  typeOfDenomination: string;
  denomination: string;
}

export const DenominationSchema = new Schema<DenominationDocument>({
  language: String,
  typeOfDenomination: String,
  denomination: String,
});