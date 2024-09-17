import type {Types, Document} from "mongoose";
import {model, Schema} from "mongoose";
import {Collection} from "@/domain/enum/collection.js";

// "EntityNumber","Language","TypeOfDenomination","Denomination"

// "0200.065.765","2","001","Intergemeentelijke Vereniging Veneco"

export interface DenominationDocument extends Document {
    entityNumber: string,
    language: string,
    typeOfDenomination: string,
    denomination: string,
}

const DenominationSchema = new Schema<DenominationDocument>(
    {
        entityNumber: {type: String, required: true},
        language: {type: String, required: true},
        typeOfDenomination: {type: String, required: true},
        denomination: {type: String, required: true},
    }
)

const DenominationModel = model<DenominationDocument>(Collection.Denomination, DenominationSchema)

export default DenominationModel;