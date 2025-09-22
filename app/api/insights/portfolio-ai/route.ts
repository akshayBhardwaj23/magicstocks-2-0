import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/lib/connect-mongo";
import User from "@/models/User";
import BrokerConnection from "@/models/BrokerConnection";
import {
  // normalizeUpstoxHoldings,
  normalizeZerodhaHoldings,
} from "@/lib/brokers";
import { perplexity } from "@/lib/customAiModel";
import { generateText } from "ai";
import { aiModelName } from "@/constants/constants";

export async function POST() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    await connectMongo();
    const user = await User.findOne({ email: session.user?.email });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const conns = await BrokerConnection.find({ userId: user._id });
    const allHoldings: any[] = [];
    for (const conn of conns) {
      try {
        if (conn.broker === "zerodha" && conn.accessToken) {
          allHoldings.push(
            ...(await normalizeZerodhaHoldings(conn.accessToken))
          );
        } else if (conn.broker === "upstox" && conn.accessToken) {
          // allHoldings.push(...(await normalizeUpstoxHoldings(conn.accessToken)));
        }
      } catch {}
    }

    const prompt = `You are a financial analyst for Indian markets (NSE/BSE). Given the user's holdings (symbol, qty, avgPrice, lastPrice), provide:
1) Portfolio overview (allocation, risk concentration, unrealized P&L)
2) Technical snapshot per major holding (trend, RSI-like note, support/resistance if relevant)
3) Fundamental quick-take if the symbol is well-known in India
4) Actionable suggestions (Buy/Sell/Hold/Watch), risks, and next steps
5) Keep it concise, bullet-style, INR amounts (₹), do not hallucinate unknown data.

Holdings JSON:
${JSON.stringify(allHoldings).slice(0, 10000)}
`;

    const result = await generateText({
      model: perplexity(aiModelName),
      system:
        "You analyze Indian equities in NSE/BSE and speak concisely in bullet points.",
      prompt,
      maxTokens: 900,
    });
    return NextResponse.json({ text: result.text });
  } catch (error) {
    console.error("[insights/portfolio-ai] failed to generate analysis", error);
    return NextResponse.json(
      { message: "Failed to generate analysis" },
      { status: 502 }
    );
  }
}
