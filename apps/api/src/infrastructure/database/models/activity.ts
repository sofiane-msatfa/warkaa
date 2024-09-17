import type {Types, Document} from "mongoose";
import {model, Schema} from "mongoose";
import {Collection} from "@/domain/enum/collection.js";

// "EntityNumber","ActivityGroup","NaceVersion","NaceCode","Classification"

//"0200.065.765","006","2008","84130","MAIN"
export interface ActivityDocument extends Document {
    entityNumber: string;
    activityGroup: string;
    naceVersion: number,
    naceCode: number,
    classification: string
}

const ActivitySchema = new Schema<ActivityDocument>(
    {
        entityNumber: {type: String, required: true},
        activityGroup: {type: String, required: true},
        naceVersion: {type: Number, required: true},
        naceCode: {type: Number, required: true},
        classification: {type: String, required: true},


    }
)

const ActivityModel = model<ActivityDocument>(Collection.Activity, ActivitySchema)

export default ActivityModel;