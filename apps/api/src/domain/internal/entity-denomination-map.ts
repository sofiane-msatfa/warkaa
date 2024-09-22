import type { DenominationDocument } from "@/infrastructure/database/models/denomination.js";
import type { Schema } from "mongoose";

export interface EntityDenominationMapValue {
  _id: Schema.Types.ObjectId;
  denominations: DenominationDocument[];
}

export type EntityDenominationMap = Map<string, EntityDenominationMapValue>;
