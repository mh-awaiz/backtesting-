import mongoose, { Schema, models, model, Types } from "mongoose";

// Chat is scoped to the CLIENT, not to an individual project — any developer
// or admin can open and take part in a client's conversation (see
// /api/chat/[clientId]). A project's assignedDeveloper is still tracked as
// the "primary owner" for status/progress purposes, it just no longer
// restricts who can chat with that client.
export interface IMessage {
  client: Types.ObjectId; // the CLIENT user this conversation belongs to
  sender?: Types.ObjectId; // absent for SYSTEM messages
  senderRole: "ADMIN" | "DEVELOPER" | "CLIENT" | "SYSTEM";
  text: string;
  fileUrl?: string;
  fileName?: string;
  readBy: Types.ObjectId[];
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  client: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  senderRole: { type: String, enum: ["ADMIN", "DEVELOPER", "CLIENT", "SYSTEM"], required: true },
  text: { type: String, required: true },
  fileUrl: { type: String },
  fileName: { type: String },
  readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

export default (models.Message as mongoose.Model<IMessage>) ||
  model<IMessage>("Message", MessageSchema);
