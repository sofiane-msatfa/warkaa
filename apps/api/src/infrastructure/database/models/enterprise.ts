import type {Types, Document} from "mongoose";
import {model, Schema} from "mongoose";
import {Collection} from "@/domain/enum/collection.js";

// "EnterpriseNumber","Status","JuridicalSituation","TypeOfEnterprise","JuridicalForm","JuridicalFormCAC","StartDate"

// "0200.065.765","AC","000","2","416",,09-08-1960

export interface EnterpriseDocument extends Document {
    enterpriseNumber: string;
    status: string;
    juridicalSituation: string;
    typeOfEnterprise: string;
    juridicalForm: string;
    startDate: Date;
}

const EnterpriseSchema = new Schema<EnterpriseDocument>(
    {
        enterpriseNumber: {type: String, required: true},
        status: {type: String, required: true},
        juridicalSituation: {type: String, required: true},
        typeOfEnterprise: {type: String, required: true},
        juridicalForm: {type: String, required: true},
        startDate: {type: Date, required: true},
    }
)

const EnterpriseModel = model<EnterpriseDocument>(Collection.Enterprise, EnterpriseSchema)

export default EnterpriseModel;