import type {Types, Document} from "mongoose";
import {model, Schema} from "mongoose";
import {Collection} from "@/domain/enum/collection.js";

// "EntityNumber","TypeOfAddress","CountryNL","CountryFR","Zipcode","MunicipalityNL","MunicipalityFR","StreetNL",
// "StreetFR","HouseNumber","Box","ExtraAddressInfo","DateStrikingOff"

// "0200.065.765","REGO",,,"9070","Destelbergen","Destelbergen","Panhuisstraat","Panhuisstraat","1","","",
// "0672.849.012","REGO","Verenigde Staten van Amerika","Etats-Unis d'Amérique","19808","Wilmington, Delaware","Wilmington, Delaware","CentervilleCorporation,Suite 400","CentervilleCorporation,Suite 400","2711","","",
export interface AddressDocument extends Document {
    entityNumber: string
    typeOfAddress: string
    countryNL: string
    countryFR: string
    zipcode: string
    municipalityNL: string
    municipalityFR: string
    streetNL: string
    streetFR: string
    houseNumber: string
    box: string
    extraAddressInfo: string
    dateStrikingOff: Date
}

const AddressSchema = new Schema<AddressDocument>(
    {
        entityNumber: { type: String, required: true },
        typeOfAddress: { type: String, required: false },
        countryNL: { type: String, required: false },
        countryFR: { type: String, required: false },
        zipcode: { type: String, required: false },
        municipalityNL: { type: String, required: false },
        municipalityFR: { type: String, required: false },
        streetNL: { type: String, required: true },
        streetFR: { type: String, required: false },
        houseNumber: { type: String, required: false },
        box: { type: String, required: false },
        extraAddressInfo: { type: String, required: false },
        dateStrikingOff: { type: Date, required: false }
    }
);

const AddressModel = model<AddressDocument>(Collection.Address, AddressSchema);

export default AddressModel;
