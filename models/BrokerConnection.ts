import mongoose from "mongoose";

export type SupportedBroker = "zerodha" | "upstox";

const BrokerConnectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    broker: {
      type: String,
      enum: ["zerodha", "upstox"],
      required: true,
      index: true,
    },
    accountId: { type: String },
    displayName: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenExpiresAt: { type: Date },
    meta: { type: Object },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform: (_: any, ret: any) => {
        delete ret._id;
        delete ret.accessToken;
        delete ret.refreshToken;
      },
    },
  }
);

BrokerConnectionSchema.index({ userId: 1, broker: 1 }, { unique: true });

const BrokerConnection =
  mongoose.models?.BrokerConnection ||
  mongoose.model("BrokerConnection", BrokerConnectionSchema);

export default BrokerConnection;
