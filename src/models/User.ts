import mongoose, { Schema, models, model } from "mongoose";

export type Role = "ADMIN" | "DEVELOPER" | "CLIENT";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  active: boolean;
  violationCount: number;
  messagingRestricted: boolean;
  company?: string;
  bio?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "DEVELOPER", "CLIENT"], default: "CLIENT" },
  active: { type: Boolean, default: true },
  violationCount: { type: Number, default: 0 },
  messagingRestricted: { type: Boolean, default: false },
  company: { type: String, trim: true },
  bio: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

export default (models.User as mongoose.Model<IUser>) || model<IUser>("User", UserSchema);
