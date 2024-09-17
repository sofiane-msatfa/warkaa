import type {Types, Document} from "mongoose";
import {model, Schema} from "mongoose";
import {Collection} from "@/domain/enum/collection.js";

// "EntityNumber","EntityContact","ContactType","Value"

// "0200.362.210","ENT","EMAIL","officiel.ic-inbw@inbw.be"

export interface ContactDocument extends Document {
    entityNumber: string;
    entityContact: string,
    contactType: string,
    value: string
}

const ContactSchema = new Schema<ContactDocument>(
    {
        entityNumber: {type: String, required: true},
        entityContact: {type: String, required: false},
        contactType: {type: String, required: false},
        value: {type: String, required: false},
    }
)

const ContactModel = model<ContactDocument>(Collection.Contact, ContactSchema)

export default ContactModel;