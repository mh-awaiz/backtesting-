import mongoose, { Schema, models, model, Types } from "mongoose";

// A single collection covers the inquiry -> project lifecycle. Early rows
// are inquiries (status "new"); once an admin assigns a developer they
// become an active project. This avoids duplicating near-identical schemas
// for "Inquiry" and "Project" while the workflow is one continuous thread.
export type ProjectStatus =
  | "new" // inquiry just submitted
  | "under_review" // admin looking at it
  | "assigned" // developer assigned, quoting/planning
  | "in_progress" // active development
  | "testing"
  | "client_review"
  | "revision"
  | "completed"
  | "rejected"
  | "cancelled";

export interface IProject {
  title: string;
  description: string;
  platformLink?: string;
  requiredFeatures?: string;
  budget?: string;
  timeline?: string;
  additionalNotes?: string;

  client: Types.ObjectId;
  assignedDeveloper?: Types.ObjectId;

  status: ProjectStatus;
  progress: number; // 0-100

  paymentAmount?: number;
  paymentStatus: "unpaid" | "claimed" | "verified";

  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    platformLink: { type: String, trim: true },
    requiredFeatures: { type: String },
    budget: { type: String, trim: true },
    timeline: { type: String, trim: true },
    additionalNotes: { type: String },

    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedDeveloper: { type: Schema.Types.ObjectId, ref: "User" },

    status: {
      type: String,
      enum: [
        "new",
        "under_review",
        "assigned",
        "in_progress",
        "testing",
        "client_review",
        "revision",
        "completed",
        "rejected",
        "cancelled",
      ],
      default: "new",
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },

    paymentAmount: { type: Number },
    paymentStatus: { type: String, enum: ["unpaid", "claimed", "verified"], default: "unpaid" },

    deadline: { type: Date },
  },
  { timestamps: true }
);

ProjectSchema.index({ client: 1, status: 1 });
ProjectSchema.index({ assignedDeveloper: 1, status: 1 });

export default (models.Project as mongoose.Model<IProject>) ||
  model<IProject>("Project", ProjectSchema);
