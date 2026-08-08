import mongoose, { Schema, models, model, Types } from "mongoose";

export interface IMessage {
  project: Types.ObjectId;
  sender: Types.ObjectId;
  senderRole: "ADMIN" | "DEVELOPER" | "CLIENT";
  text: string;
  fileUrl?: string;
  fileName?: string;
  readBy: Types.ObjectId[];
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  senderRole: { type: String, enum: ["ADMIN", "DEVELOPER", "CLIENT"], required: true },
  text: { type: String, required: true },
  fileUrl: { type: String },
  fileName: { type: String },
  readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

export default (models.Message as mongoose.Model<IMessage>) ||
  model<IMessage>("Message", MessageSchema);
