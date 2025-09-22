import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/lib/connect-mongo";
import BrokerConnection from "@/models/BrokerConnection";
import User from "@/models/User";
import { normalizeZerodhaHoldings } from "@/lib/brokers";

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
  const failures: string[] = [];
  for (const conn of connections) {
    try {
      if (conn.broker === "zerodha" && conn.accessToken) {
        const rows = await normalizeZerodhaHoldings(conn.accessToken);
        results.push(...rows);
      } else if (conn.broker === "upstox" && conn.accessToken) {
        console.warn(
          "[portfolio/holdings] upstox holdings fetch not yet supported"
        );
        failures.push("upstox");
      }
    } catch (error) {
      console.error(
        `[portfolio/holdings] ${conn.broker} holdings fetch failed`,
        error
      );
      failures.push(conn.broker);
    }
  }

  if (
    results.length === 0 &&
    failures.length === connections.length &&
    connections.length > 0
  ) {
    return NextResponse.json(
      { message: "All broker fetches failed", failures },
      { status: 502 }
    );
  }

  return NextResponse.json({ holdings: results, failures });
}
