import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    status: { type: String },
    plan: { type: String },
    amount: { type: String },
    currency: { type: String },
    orderId: { type: String },
    paymentId: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
      },
    },
  }
);

const Order = mongoose.models?.Order || mongoose.model("Order", OrderSchema);

export default Order;
