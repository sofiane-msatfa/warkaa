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
  branchNumber: string;
  startDate: Date;
  enterprise: Schema.Types.ObjectId;
  enterpriseNumber: string;
  activities: ActivityDocument[];
  addresses: AddressDocument[];
  contacts: ContactDocument[];
  denominations: DenominationDocument[];
}

const BranchSchema = new Schema<BranchDocument>({
  branchNumber: { type: String, required: true, unique: true },
  startDate: Date,
  enterprise: {
    type: Schema.Types.ObjectId,
    ref: Collection.Enterprise,
    required: true,
  },
  enterpriseNumber: { type: String, required: true },
  activities: [ActivitySchema],
  addresses: [AddressSchema],
  contacts: [ContactSchema],
  denominations: [DenominationSchema],
});

const BranchModel = model<BranchDocument>(Collection.Branch, BranchSchema);

export default BranchModel;
