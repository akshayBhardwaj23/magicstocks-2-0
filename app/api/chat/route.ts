import { auth } from "@/auth";
import { aiModelName, aiSystemMessage } from "@/constants/constants";
import connectMongo from "@/lib/connect-mongo";
import { perplexity } from "@/lib/customAiModel";
import { computePortfolioInsights } from "@/lib/insights/portfolio";
import { buildPortfolioChatContext } from "@/lib/portfolio/buildChatContext";
import { loadHoldingsForUser } from "@/lib/portfolio/loadUserHoldings";
import { storeChatsInDB } from "@/lib/storeChats";
import PortfolioSnapshot from "@/models/PortfolioSnapshot";
import User from "@/models/User";
import { streamText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const PORTFOLIO_SYSTEM_ADDENDUM = `
When the request includes PORTFOLIO_CONTEXT, treat it as the authoritative user snapshot.
- Answer portfolio-specific questions from this context only.
- If asked about a symbol not in the context, say it is not present in the provided snapshot.
- Do not provide personalized buy/sell/hold instructions; keep educational framing and uncertainty clear.
- Portfolio data may be user-uploaded/OCR-derived; mention this if data quality is uncertain.
`;

export async function POST(req: Request) {
  try {
    const session = await auth();

    const { messages, portfolioContext } = await req.json();

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
    const shouldUsePortfolio = Boolean(portfolioContext);

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request", message: "Messages are required." },
        { status: 400 }
      );
    }

    let systemPrompt = aiSystemMessage;

    if (shouldUsePortfolio) {
      const { holdings, dataSource } = await loadHoldingsForUser(user._id);
      if (holdings.length === 0) {
        return NextResponse.json(
          {
            error: "No holdings loaded",
            message:
              "No holdings found. Upload screenshots or add rows in Portfolio before using portfolio chat.",
            code: "NO_HOLDINGS",
          },
          { status: 400 }
        );
      }

      const insights = computePortfolioInsights(holdings as any);
      const snapshot = await PortfolioSnapshot.findOne({ userId: user._id }).select(
        { updatedAt: 1 }
      );
      const contextBlock = buildPortfolioChatContext({
        holdings,
        dataSource,
        insights,
        asOf: snapshot?.updatedAt || null,
      });

      systemPrompt = `${aiSystemMessage}\n${PORTFOLIO_SYSTEM_ADDENDUM}\n---\n${contextBlock}`;
    }

    const result = await streamText({
      model: perplexity(aiModelName),
      system: systemPrompt,
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
