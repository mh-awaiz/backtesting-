import mongoose, { Schema, models, model } from "mongoose";

export interface IIndicator {
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  features: string[];
  markets: string[];
  timeframes: string[];
  thumbnail?: string;
  featured: boolean;
  published: boolean;
  createdAt: Date;
}

const IndicatorSchema = new Schema<IIndicator>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  category: { type: String, required: true, trim: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ type: String }],
  markets: [{ type: String }],
  timeframes: [{ type: String }],
  thumbnail: { type: String },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default (models.Indicator as mongoose.Model<IIndicator>) ||
  model<IIndicator>("Indicator", IndicatorSchema);
