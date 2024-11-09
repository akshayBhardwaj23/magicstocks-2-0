import Chat from "@/models/Chat";
import User from "@/models/User";

export async function storeChatsInDB(
  userId: String,
  userMessage: String,
  botMessage: String,
  finishReason: String,
  promptTokens: Number,
  completionTokens: Number,
  totalTokens: Number
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

const decrementUserChats = async (userId: String) => {
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
