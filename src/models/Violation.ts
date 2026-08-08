import mongoose, { Schema, models, model, Types } from "mongoose";

export interface IViolation {
  project: Types.ObjectId;
  user: Types.ObjectId;
  originalText: string;
  reason: string;
  createdAt: Date;
}

const ViolationSchema = new Schema<IViolation>({
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  originalText: { type: String, required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default (models.Violation as mongoose.Model<IViolation>) ||
  model<IViolation>("Violation", ViolationSchema);
