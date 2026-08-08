import mongoose, { Schema, models, model } from "mongoose";

// A "Lead" is a lightweight, no-account-required capture — someone
// interested but not ready to submit a full project brief. This is
// intentionally separate from Project (which covers the full
// inquiry -> assignment -> project lifecycle and requires an account):
// leads are the top of the funnel, inquiries are the middle.
export interface ILead {
  name: string;
  email: string;
  message: string;
  source: string; // where on the site the lead came from, e.g. "homepage", "indicator:trend-filter-pro"
  status: "new" | "contacted" | "converted" | "closed";
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  message: { type: String, required: true, trim: true },
  source: { type: String, default: "homepage", trim: true },
  status: {
    type: String,
    enum: ["new", "contacted", "converted", "closed"],
    default: "new",
  },
  createdAt: { type: Date, default: Date.now },
});

LeadSchema.index({ status: 1, createdAt: -1 });

export default (models.Lead as mongoose.Model<ILead>) || model<ILead>("Lead", LeadSchema);
