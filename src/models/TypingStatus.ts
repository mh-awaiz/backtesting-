import mongoose, { Schema, models, model, Types } from "mongoose";

// Ephemeral "is typing" state, one doc per (client thread, user). Read by
// polling and considered stale after a few seconds — no need to ever
// delete these explicitly, a short TTL index keeps the collection tidy.
export interface ITypingStatus {
  client: Types.ObjectId; // which conversation
  user: Types.ObjectId; // who's typing
  role: "ADMIN" | "DEVELOPER" | "CLIENT";
  updatedAt: Date;
}

const TypingStatusSchema = new Schema<ITypingStatus>({
  client: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["ADMIN", "DEVELOPER", "CLIENT"], required: true },
  updatedAt: { type: Date, default: Date.now },
});

TypingStatusSchema.index({ client: 1, user: 1 }, { unique: true });
// TTL: Mongo auto-deletes a doc 15s after its updatedAt — comfortably past
// the ~4s staleness window the typing endpoint already applies.
TypingStatusSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 15 });

export default (models.TypingStatus as mongoose.Model<ITypingStatus>) ||
  model<ITypingStatus>("TypingStatus", TypingStatusSchema);
