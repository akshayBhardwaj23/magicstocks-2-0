import mongoose from "mongoose";

/**
 * Append-only log for calibrating API cost vs credits (export / aggregate in Mongo).
 */
const UsageEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    feature: {
      type: String,
      required: true,
      enum: ["chat", "vision_upload", "portfolio_ai"],
      index: true,
    },
    credits: { type: Number, default: 0 },
    /** e.g. imageCount, promptTokens, text length */
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

UsageEventSchema.index({ createdAt: -1 });
UsageEventSchema.index({ userId: 1, createdAt: -1 });

const UsageEvent =
  mongoose.models?.UsageEvent ||
  mongoose.model("UsageEvent", UsageEventSchema);

export default UsageEvent;
