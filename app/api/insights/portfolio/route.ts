import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/lib/connect-mongo";
import User from "@/models/User";
import PortfolioSnapshot from "@/models/PortfolioSnapshot";
import PortfolioSnapshotHistory from "@/models/PortfolioSnapshotHistory";
import { computePortfolioInsights } from "@/lib/insights/portfolio";
import { loadHoldingsForUser } from "@/lib/portfolio/loadUserHoldings";

const MAX_SERIES = 60;

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

  const snapshot = await PortfolioSnapshot.findOne({ userId: user._id });
  const history = await PortfolioSnapshotHistory.find({ userId: user._id })
    .sort({ takenAt: 1 })
    .limit(MAX_SERIES)
    .select({ takenAt: 1, totalInvested: 1, totalCurrent: 1, rowCount: 1 });

  const series = history.map((row: any) => ({
    date: row.takenAt,
    invested: Number(row.totalInvested) || 0,
    value: Number(row.totalCurrent) || 0,
    rowCount: Number(row.rowCount) || 0,
  }));

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
    lastUpdated: snapshot?.updatedAt || null,
    snapshotSource: snapshot?.source || null,
    series,
    snapshotCount: series.length,
  });
}
