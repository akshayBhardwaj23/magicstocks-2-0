import { auth } from "@/auth";
import connectMongo from "@/lib/connect-mongo";
import User from "@/models/User";
import PortfolioSnapshot from "@/models/PortfolioSnapshot";
import PortfolioSnapshotHistory from "@/models/PortfolioSnapshotHistory";
import { computePortfolioInsights } from "@/lib/insights/portfolio";
import { diffHoldings, summarizeDiff } from "@/lib/portfolio/diff";
import { applyFxToHoldings } from "@/lib/portfolio/applyFx";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { NormalizedHolding } from "@/lib/brokers";

const editSchema = z.object({
  holdings: z
    .array(
      z.object({
        symbol: z.string().min(1).max(160),
        quantity: z.number().nonnegative(),
        avgPrice: z.number().nonnegative(),
        lastPrice: z.number().nonnegative().optional(),
        assetType: z
          .enum([
            "stock",
            "etf",
            "mutual_fund",
            "foreign_stock",
            "gold_bond",
            "debt",
            "other",
          ])
          .optional(),
        currency: z.string().max(8).optional(),
      })
    )
    .max(500),
});

function totals(holdings: NormalizedHolding[]) {
  let invested = 0;
  let current = 0;
  for (const h of holdings) {
    const qty = h.quantity || 0;
    const avg =
      h.avgPriceInr != null && Number.isFinite(h.avgPriceInr)
        ? Number(h.avgPriceInr)
        : Number(h.avgPrice) || 0;
    const last =
      h.lastPriceInr != null && Number.isFinite(h.lastPriceInr)
        ? Number(h.lastPriceInr)
        : h.lastPrice != null
          ? Number(h.lastPrice)
          : avg;
    invested += avg * qty;
    current += last * qty;
  }
  return { invested, current };
}

/** Save manually edited holdings, replacing the current snapshot and appending history. */
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const parsed = editSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid holdings", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const cleanedRaw: NormalizedHolding[] = parsed.data.holdings
    .filter((h) => h.symbol.trim().length > 0 && h.quantity > 0)
    .map((h) => ({
      broker: "upload",
      symbol: h.symbol.trim().slice(0, 160),
      quantity: h.quantity,
      avgPrice: h.avgPrice,
      lastPrice: h.lastPrice ?? h.avgPrice,
      assetType: h.assetType || "stock",
      currency: (h.currency || "INR").toUpperCase(),
    }));

  // Stamp INR-equivalent prices so a USD edit does not get summed as ₹.
  const cleaned = await applyFxToHoldings(cleanedRaw);

  const previous = await PortfolioSnapshot.findOne({ userId: user._id });
  const prevHoldings = (previous?.holdings as NormalizedHolding[]) || [];
  const diff = diffHoldings(prevHoldings, cleaned);

  const updated = await PortfolioSnapshot.findOneAndUpdate(
    { userId: user._id },
    { $set: { holdings: cleaned, source: "manual" } },
    { upsert: true, new: true }
  );

  const { invested, current } = totals(cleaned);
  await PortfolioSnapshotHistory.create({
    userId: user._id,
    takenAt: new Date(),
    source: "manual",
    holdings: cleaned,
    totalInvested: invested,
    totalCurrent: current,
    rowCount: cleaned.length,
  });

  return NextResponse.json({
    ok: true,
    count: cleaned.length,
    holdings: cleaned,
    insights: computePortfolioInsights(cleaned),
    diff,
    diffSummary: summarizeDiff(diff),
    lastUpdated: updated?.updatedAt || new Date(),
  });
}

/** Clear screenshot-derived holdings so broker or empty state shows again. */
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  await PortfolioSnapshot.findOneAndDelete({ userId: user._id });
  await PortfolioSnapshotHistory.deleteMany({ userId: user._id });
  return NextResponse.json({ ok: true });
}
