import type {Types, Document} from "mongoose";
import {model, Schema} from "mongoose";
import {Collection} from "@/domain/enum/collection.js";

//"Id","StartDate","EnterpriseNumber"

// "9.000.006.626",01-09-1995,"0257.883.408"
export interface BranchDocument extends Document {
    id: string;
    startDate: Date;
    enterpriseName: string
}

const BranchSchema = new Schema<BranchDocument>(
    {
        id: {type: String, required: true},
        startDate: {type: Date, required: true},
        enterpriseName: {type: String, required: false}
    }
)

const BranchModel = model<BranchDocument>(Collection.Branch, BranchSchema)

export default BranchModel;