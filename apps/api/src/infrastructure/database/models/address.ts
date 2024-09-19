import type { Document } from "mongoose";
import { model, Schema } from "mongoose";
import { Collection } from "@/domain/enum/collection.js";

// "EntityNumber","TypeOfAddress","CountryNL","CountryFR","Zipcode","MunicipalityNL","MunicipalityFR","StreetNL",
// "StreetFR","HouseNumber","Box","ExtraAddressInfo","DateStrikingOff"

// "0200.065.765","REGO",,,"9070","Destelbergen","Destelbergen","Panhuisstraat","Panhuisstraat","1","","",
// "0672.849.012","REGO","Verenigde Staten van Amerika","Etats-Unis d'Amérique","19808","Wilmington, Delaware","Wilmington, Delaware","CentervilleCorporation,Suite 400","CentervilleCorporation,Suite 400","2711","","",
export interface AddressDocument extends Document {
  typeOfAddress: string;
  countryNL: string;
  countryFR: string;
  zipcode: string;
  municipalityNL: string;
  municipalityFR: string;
  streetNL: string;
  streetFR: string;
  houseNumber: string;
  box: string;
  extraAddressInfo: string;
  dateStrikingOff: Date;
}

export const AddressSchema = new Schema<AddressDocument>({
  typeOfAddress: String,
  countryNL: String,
  countryFR: String,
  zipcode: String,
  municipalityNL: String,
  municipalityFR: String,
  streetNL: String,
  streetFR: String,
  houseNumber: String,
  box: String,
  extraAddressInfo: String,
  dateStrikingOff: Date,
});
