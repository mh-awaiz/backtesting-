import mongoose, { Schema, models, model } from "mongoose";

export type Role = "ADMIN" | "DEVELOPER" | "CLIENT";

export interface IUser {
  name: string;
  email: string;
  passwordHash?: string; // absent for Google-only accounts
  role: Role;
  active: boolean;
  violationCount: number;
  messagingRestricted: boolean;
  available: boolean; // developer online/offline for chat + auto-assignment
  company?: string;
  bio?: string;
  lastSeenAt?: Date; // passive activity presence — see PresenceHeartbeat
  timezone?: string; // IANA zone, captured client-side on login/register
  locationCity?: string; // from Vercel's geo headers, best-effort
  locationCountry?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String },
  role: { type: String, enum: ["ADMIN", "DEVELOPER", "CLIENT"], default: "CLIENT" },
  active: { type: Boolean, default: true },
  violationCount: { type: Number, default: 0 },
  messagingRestricted: { type: Boolean, default: false },
  available: { type: Boolean, default: false },
  company: { type: String, trim: true },
  bio: { type: String, trim: true },
  lastSeenAt: { type: Date },
  timezone: { type: String, trim: true },
  locationCity: { type: String, trim: true },
  locationCountry: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

export default (models.User as mongoose.Model<IUser>) || model<IUser>("User", UserSchema);
