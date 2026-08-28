import mongoose, { Schema, models, model, Types } from "mongoose";

export interface IViolation {
  client: Types.ObjectId; // which client's conversation this happened in
  user: Types.ObjectId; // the developer who sent the flagged message
  originalText: string;
  reason: string;
  createdAt: Date;
}

const ViolationSchema = new Schema<IViolation>({
  client: { type: Schema.Types.ObjectId, ref: "User", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  originalText: { type: String, required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default (models.Violation as mongoose.Model<IViolation>) ||
  model<IViolation>("Violation", ViolationSchema);
