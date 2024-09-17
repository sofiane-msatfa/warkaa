import type {Types, Document} from "mongoose";
import {model, Schema} from "mongoose";
import {Collection} from "@/domain/enum/collection.js";

// "EstablishmentNumber","StartDate","EnterpriseNumber"

// "2.000.000.339",01-11-1974,"0403.449.823"

export interface EstablishmentDocument extends Document {
    establishmentNumber: string,
    enterpriseNumber: string,
    startDate: Date,
}

const EstablishmentSchema = new Schema<EstablishmentDocument>(
    {
        establishmentNumber: {type: String, required: true},
        enterpriseNumber: {type: String, required: false},
        startDate: {type: Date, required: false},
    }
)

const EstablishmentModel = model<EstablishmentDocument>(Collection.Establishment, EstablishmentSchema)

export default EstablishmentModel;