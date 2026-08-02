import mongoose, { Schema, models, model } from "mongoose";

export interface ILead {
  name: string;
  email: string;
  platform: "TradingView" | "MT4" | "MT5" | "Python" | "Other";
  package: "Basic" | "Standard" | "Standard+" | "Premium" | "Not sure yet";
  details: string;
  status: "new" | "contacted" | "in-progress" | "delivered";
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  platform: {
    type: String,
    enum: ["TradingView", "MT4", "MT5", "Python", "Other"],
    default: "TradingView",
  },
  package: {
    type: String,
    enum: ["Basic", "Standard", "Standard+", "Premium", "Not sure yet"],
    default: "Not sure yet",
  },
  details: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ["new", "contacted", "in-progress", "delivered"],
    default: "new",
  },
  createdAt: { type: Date, default: Date.now },
});

export default (models.Lead as mongoose.Model<ILead>) || model<ILead>("Lead", LeadSchema);
