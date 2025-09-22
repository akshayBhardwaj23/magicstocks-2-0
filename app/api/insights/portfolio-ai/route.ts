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

export const runtime = "nodejs";
export const maxDuration = 30;

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
    const tasks: Promise<any>[] = conns.map((conn: any) => {
      if (conn.broker === "zerodha" && conn.accessToken) {
        return normalizeZerodhaHoldings(conn.accessToken);
      }
      // Upstox currently not supported
      return Promise.resolve([]);
    });
    const settled = await Promise.allSettled(tasks);
    for (const s of settled) {
      if (s.status === "fulfilled" && Array.isArray(s.value)) {
        allHoldings.push(...s.value);
      }
    }

    const prompt = `You are a financial analyst for Indian markets (NSE/BSE). Given the user's holdings (symbol, qty, avgPrice, lastPrice), provide:
1) Portfolio overview (allocation, risk concentration, unrealized P&L)
2) Technical snapshot per major holding (trend, RSI-like note, support/resistance if relevant)
3) Fundamental quick-take if the symbol is well-known in India
4) Actionable suggestions (Buy/Sell/Hold/Watch), risks, and next steps
5) Keep it concise, bullet-style, INR amounts (₹), do not hallucinate unknown data.

Holdings JSON:
${JSON.stringify(allHoldings).slice(0, 3000)}
`;

    const result = await Promise.race([
      generateText({
        model: perplexity(aiModelName),
        system:
          "You analyze Indian equities in NSE/BSE and speak concisely in bullet points.",
        prompt,
        maxTokens: 300,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 8000)
      ),
    ]);
    const text = (result as any)?.text ?? "";
    return NextResponse.json({ text });
  } catch (error) {
    console.error("[insights/portfolio-ai] failed to generate analysis", error);
    return NextResponse.json(
      { message: "Failed to generate analysis" },
      { status: 502 }
    );
  }
}
