import type {Types, Document} from "mongoose";
import {model, Schema} from "mongoose";

export interface TestDocument extends Document {
    description: string;
    name: string;
    createdAt: Date
}

const testSchema = new Schema<TestDocument>(
    {
        name: {type: String, required: true},
        description: {type: String},
        createdAt: {type: Date, required: true}


    }
)
// We can use an enum to set the key
// model<TestDocument>(collection.Test)
const TestModel = model<TestDocument>("Test", testSchema)

export default TestModel;