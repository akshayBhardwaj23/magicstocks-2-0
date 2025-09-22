import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/lib/connect-mongo";
import BrokerConnection from "@/models/BrokerConnection";
import User from "@/models/User";
import {
  normalizeUpstoxHoldings,
  normalizeZerodhaHoldings,
} from "@/lib/brokers";

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

  const results: any[] = [];
  for (const conn of connections) {
    try {
      if (conn.broker === "zerodha" && conn.accessToken) {
        const rows = await normalizeZerodhaHoldings(conn.accessToken);
        results.push(...rows);
      } else if (conn.broker === "upstox" && conn.accessToken) {
        const rows = await normalizeUpstoxHoldings(conn.accessToken);
        results.push(...rows);
      }
    } catch (e: any) {
      // continue on error for one broker
    }
  }

  return NextResponse.json({ holdings: results });
}
