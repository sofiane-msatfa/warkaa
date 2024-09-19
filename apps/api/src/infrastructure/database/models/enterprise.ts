import type { Document } from "mongoose";
import { model, Schema } from "mongoose";
import { Collection } from "@/domain/enum/collection.js";
import { ActivitySchema, type ActivityDocument } from "./activity.js";
import { ContactSchema, type ContactDocument } from "./contact.js";
import {
  DenominationSchema,
  type DenominationDocument,
} from "./denomination.js";
import { AddressSchema, type AddressDocument } from "./address.js";

// "EnterpriseNumber","Status","JuridicalSituation","TypeOfEnterprise","JuridicalForm","JuridicalFormCAC","StartDate"
// "0200.065.765","AC","000","2","416",,09-08-1960
export interface EnterpriseDocument extends Document {
  enterpriseNumber: string;
  status: string;
  juridicalSituation: string;
  typeOfEnterprise: string;
  juridicalForm: string;
  juridicalFormCAC: string;
  startDate: Date;
  activities: ActivityDocument[];
  addresses: AddressDocument[];
  contacts: ContactDocument[];
  denominations: DenominationDocument[];
}

const EnterpriseSchema = new Schema<EnterpriseDocument>({
  enterpriseNumber: { type: String, required: true, unique: true },
  status: String,
  juridicalSituation: String,
  typeOfEnterprise: String,
  juridicalForm: String,
  juridicalFormCAC: String,
  startDate: Date,
  activities: [ActivitySchema],
  addresses: [AddressSchema],
  contacts: [ContactSchema],
  denominations: [DenominationSchema],
});

const EnterpriseModel = model<EnterpriseDocument>(
  Collection.Enterprise,
  EnterpriseSchema
);

export default EnterpriseModel;
