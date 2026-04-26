import mongoose from "mongoose";

const PortfolioSnapshotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    /** Normalized rows from screenshot OCR + vision; replaces prior snapshot on new upload */
    holdings: { type: [mongoose.Schema.Types.Mixed], default: [] },
    source: { type: String, default: "screenshot" },
  },
  { timestamps: true }
);


const PortfolioSnapshot =
  mongoose.models?.PortfolioSnapshot ||
  mongoose.model("PortfolioSnapshot", PortfolioSnapshotSchema);

export default PortfolioSnapshot;
