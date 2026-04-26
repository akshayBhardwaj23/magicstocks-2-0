import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/lib/connect-mongo";
import User from "@/models/User";
import { computePortfolioInsights } from "@/lib/insights/portfolio";
import { loadHoldingsForUser } from "@/lib/portfolio/loadUserHoldings";

export async function GET() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await connectMongo();
  const user = await User.findOne({ email: session.user?.email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { holdings, dataSource, failures } = await loadHoldingsForUser(
    user._id
  );

  const insights = computePortfolioInsights(holdings);
  if (
    holdings.length === 0 &&
    failures.length > 0 &&
    dataSource === "none"
  ) {
    return NextResponse.json(
      { message: "Could not load portfolio data", failures, dataSource },
      { status: 502 }
    );
  }

  return NextResponse.json({
    holdings,
    insights,
    failures,
    dataSource,
  });
}
