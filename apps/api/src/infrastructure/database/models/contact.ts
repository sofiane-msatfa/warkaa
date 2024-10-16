import type { Document } from "mongoose";
import { Schema } from "mongoose";

// "EntityNumber","EntityContact","ContactType","Value"
// "0200.362.210","ENT","EMAIL","officiel.ic-inbw@inbw.be"
export interface ContactDocument extends Document {
  entityContact: string;
  contactType: string;
  value: string;
}

export const ContactSchema = new Schema<ContactDocument>({
  entityContact: String,
  contactType: String,
  value: String,
});
