import type {Types, Document} from "mongoose";
import {model, Schema} from "mongoose";
import {Collection} from "@/domain/enum/collection.js";
import type {EnterpriseDocument} from "@/infrastructure/database/models/enterprise.js";

// "EntityNumber","ActivityGroup","NaceVersion","NaceCode","Classification"

//"0200.065.765","006","2008","84130","MAIN"
export interface ActivityDocument extends Document {
    entityNumber: string
    activityGroup: string
    naceVersion: number
    naceCode: number
    classification: string
}

const ActivitySchema = new Schema<ActivityDocument>(
    {
        entityNumber: {type: String, required: true},
        activityGroup: {type: String, required: false},
        naceVersion: {type: Number, required: false},
        naceCode: {type: Number, required: false},
        classification: {type: String, required: false},
    }
)

const ActivityModel = model<ActivityDocument>(Collection.Activity, ActivitySchema)

export default ActivityModel;