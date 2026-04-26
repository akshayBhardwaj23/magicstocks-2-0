import mongoose from "mongoose";

/**
 * Append-only history of portfolio snapshots, one row per upload or manual edit.
 * Used to draw the equity curve and to diff "what changed" between snapshots.
 */
const PortfolioSnapshotHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    takenAt: { type: Date, default: () => new Date(), index: true },
    source: {
      type: String,
      enum: ["screenshot", "manual", "broker"],
      default: "screenshot",
    },
    holdings: { type: [mongoose.Schema.Types.Mixed], default: [] },
    totalInvested: { type: Number, default: 0 },
    totalCurrent: { type: Number, default: 0 },
    rowCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PortfolioSnapshotHistorySchema.index({ userId: 1, takenAt: -1 });

const PortfolioSnapshotHistory =
  mongoose.models?.PortfolioSnapshotHistory ||
  mongoose.model("PortfolioSnapshotHistory", PortfolioSnapshotHistorySchema);

export default PortfolioSnapshotHistory;
