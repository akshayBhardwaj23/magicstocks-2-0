import { auth } from "@/auth";
import { aiModelName, aiSystemMessage } from "@/constants/constants";
import connectMongo from "@/lib/connect-mongo";
import { perplexity } from "@/lib/customAiModel";
import { storeChatsInDB } from "@/lib/storeChats";
import User from "@/models/User";
import { streamText } from "ai";
import { NextResponse } from "next/server";

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

    if (user.current_messages < 1) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          message:
            "You have no credits left. Purchase a pack to continue chatting.",
          remainingCredits: user.current_messages,
          code: "INSUFFICIENT_CREDITS",
        },
        { status: 402 }
      );
    }

    const userIdStr = String(user._id);

    const result = await streamText({
      model: perplexity(aiModelName),
      system: aiSystemMessage,
      messages,
      maxTokens: 1000,
      onFinish: async ({ text, finishReason, usage }) => {
        await storeChatsInDB(
          userIdStr,
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
    return NextResponse.json(
      { error: err.message || "Request failed" },
      { status: 429 }
    );
  }
}
