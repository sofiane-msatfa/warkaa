import type { AddressDocument } from "@/infrastructure/database/models/address.js";
import type { Schema } from "mongoose";

export interface EntityAddressMapValue {
  _id: Schema.Types.ObjectId;
  addresses: AddressDocument[];
}

export type EntityAddressMap = Map<string, EntityAddressMapValue>;
