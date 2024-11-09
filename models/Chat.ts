import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userMessage: { type: String, required: true },
    botMessage: { type: String },
    finishReason: { type: String },
    promptTokens: { type: Number },
    completionTokens: { type: Number },
    totalTokens: { type: Number },
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

// Check if the model already exists before defining it
const Chat = mongoose.models?.Chat || mongoose.model("Chat", ChatSchema);

export default Chat;
