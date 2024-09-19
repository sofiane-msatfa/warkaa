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

// "EstablishmentNumber","StartDate","EnterpriseNumber"
// "2.000.000.339",01-11-1974,"0403.449.823"
export interface EstablishmentDocument extends Document {
  establishmentNumber: string;
  startDate: Date;
  enterpriseNumber: Schema.Types.ObjectId;
  activities: ActivityDocument[];
  addresses: AddressDocument[];
  contacts: ContactDocument[];
  denominations: DenominationDocument[];
}

const EstablishmentSchema = new Schema<EstablishmentDocument>({
  establishmentNumber: { type: String, required: true },
  startDate: { type: Date, required: false },
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

const EstablishmentModel = model<EstablishmentDocument>(
  Collection.Establishment,
  EstablishmentSchema
);

export default EstablishmentModel;
