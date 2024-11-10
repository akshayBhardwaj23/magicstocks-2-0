import Chat from "@/models/Chat";
import User from "@/models/User";
import connectMongo from "./connect-mongo";

export async function storeChatsInDB(
  userId: string,
  userMessage: string,
  botMessage: string,
  finishReason: string,
  promptTokens: number,
  completionTokens: number,
  totalTokens: number
) {
  try {
    await Chat.create({
      userId: userId,
      userMessage: userMessage,
      botMessage: botMessage,
      finishReason: finishReason,
      promptTokens: promptTokens,
      completionTokens: completionTokens,
      totalTokens: totalTokens,
    });
    decrementUserChats(userId);
  } catch (err) {
    console.error("Error creating bot Chat:", err);
  }
}

const decrementUserChats = async (userId: string) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { current_messages: -1 },
      },
      { new: true }
    );
    if (!user) {
      throw new Error("User not found");
    }
  } catch (err) {
    console.error("Error decrementing user chats:", err);
  }
};

export const getChatHistory = async (email: string | undefined | null) => {
  await connectMongo();
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const chats = await Chat.find({ userId: user._id }).sort({ createdAt: -1 });
    if (chats.length === 0) {
      return 0;
    }
    return chats;
  } catch (err) {
    console.error("Error in getting chat history:", err);
  }
};
