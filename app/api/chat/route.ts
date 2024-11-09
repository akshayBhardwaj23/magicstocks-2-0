import { auth } from "@/auth";
import { aiModelName, aiSystemMessage } from "@/constants/constants";
import connectMongo from "@/lib/connect-mongo";
import { perplexity } from "@/lib/customAiModel";
import { storeChatsInDB } from "@/lib/storeChats";
import User from "@/models/User";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await auth();

    const { messages } = await req.json();

    if (!session) {
      throw new Error("Login Again");
    }

    await connectMongo();
    const user = await User.findOne({ email: session.user?.email });
    const userMessage = messages[messages.length - 1];

    if (!user) {
      throw new Error("Login Again");
    }

    if (user.current_messages === 0) {
      throw new Error("Credits expired, purchase a plan");
    }

    const result = await streamText({
      model: perplexity(aiModelName),
      system: aiSystemMessage,
      messages,
      maxTokens: 1000,
      onFinish: async ({ text, finishReason, usage }) => {
        await storeChatsInDB(
          user,
          userMessage.content,
          text,
          finishReason,
          usage.promptTokens,
          usage.completionTokens,
          usage.totalTokens
        );
      },
    });

    return result.toDataStreamResponse();
  } catch (err: any) {
    console.error("There is some error: " + err.message);
    const result = await streamText({
      model: perplexity(aiModelName),
      system: `Just return the prompt from user`,
      prompt: err.message,
      maxTokens: 100,
    });

    return result.toDataStreamResponse();
  }
}
