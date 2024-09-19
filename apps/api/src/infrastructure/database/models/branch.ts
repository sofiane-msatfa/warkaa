import type { Document } from "mongoose";
import { model, Schema } from "mongoose";
import { Collection } from "@/domain/enum/collection.js";
import { ActivitySchema, type ActivityDocument } from "./activity.js";
import { AddressSchema, type AddressDocument } from "./address.js";
import { ContactSchema, type ContactDocument } from "./contact.js";
import {
  DenominationSchema,
  type DenominationDocument,
} from "./denomination.js";

//"Id","StartDate","EnterpriseNumber"
// "9.000.006.626",01-09-1995,"0257.883.408"
export interface BranchDocument extends Document {
  id: string;
  startDate: Date;
  enterpriseNumber: Schema.Types.ObjectId;
  activities: ActivityDocument[];
  addresses: AddressDocument[];
  contacts: ContactDocument[];
  denominations: DenominationDocument[];
}

const BranchSchema = new Schema<BranchDocument>({
  id: { type: String, required: true, unique: true },
  startDate: Date,
  enterpriseNumber: {
    type: Schema.Types.ObjectId,
    ref: Collection.Enterprise,
    required: true,
  },
  activities: [ActivitySchema],
  addresses: [AddressSchema],
  contacts: [ContactSchema],
  denominations: [DenominationSchema],
});

const BranchModel = model<BranchDocument>(Collection.Branch, BranchSchema);

export default BranchModel;
