import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/lib/connect-mongo";
import BrokerConnection from "@/models/BrokerConnection";
import User from "@/models/User";
import {
  // normalizeUpstoxHoldings,
  normalizeZerodhaHoldings,
} from "@/lib/brokers";
import { computePortfolioInsights } from "@/lib/insights/portfolio";

export async function GET() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await connectMongo();
  const user = await User.findOne({ email: session.user?.email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const connections = await BrokerConnection.find({ userId: user._id });

  const allHoldings: any[] = [];
  const failures: string[] = [];
  for (const conn of connections) {
    try {
      if (conn.broker === "zerodha" && conn.accessToken) {
        const rows = await normalizeZerodhaHoldings(conn.accessToken);
        allHoldings.push(...rows);
      } else if (conn.broker === "upstox" && conn.accessToken) {
        // const rows = await normalizeUpstoxHoldings(conn.accessToken);
        // allHoldings.push(...rows);
      }
    } catch (error) {
      console.error(
        `[insights/portfolio] ${conn.broker} holdings fetch failed`,
        error
      );
      failures.push(conn.broker);
    }
  }

  const insights = computePortfolioInsights(allHoldings);
  if (
    allHoldings.length === 0 &&
    failures.length === connections.length &&
    connections.length > 0
  ) {
    return NextResponse.json(
      { message: "All broker fetches failed", failures },
      { status: 502 }
    );
  }

  return NextResponse.json({ holdings: allHoldings, insights, failures });
}
