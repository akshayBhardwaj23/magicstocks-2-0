import { NormalizedHolding } from "@/lib/brokers";

export type HoldingInsight = NormalizedHolding & {
  weightPct: number;
  unrealizedPnl?: number;
  recommendation?: "Buy" | "Sell" | "Hold";
  rationale?: string;
};

export type PortfolioInsights = {
  totalInvested: number;
  totalCurrent: number;
  totalUnrealizedPnl: number;
  topPositions: HoldingInsight[];
  diversificationNote?: string;
};

export function computePortfolioInsights(
  holdings: NormalizedHolding[]
): PortfolioInsights {
  // Basic PnL/weights and naive recommendations as a first version
  const enriched: HoldingInsight[] = holdings.map((h) => {
    const invested = h.quantity * h.avgPrice;
    const current = h.quantity * (h.lastPrice || h.avgPrice);
    const unrealized = current - invested;
    const rec = computeSimpleRecommendation(
      h.avgPrice,
      h.lastPrice || h.avgPrice
    );
    return {
      ...h,
      unrealizedPnl: unrealized,
      recommendation: rec.recommendation,
      rationale: rec.rationale,
      weightPct: 0,
    };
  });

  const totalCurrent = enriched.reduce(
    (sum, r) => sum + r.quantity * (r.lastPrice || r.avgPrice),
    0
  );
  const totalInvested = enriched.reduce(
    (sum, r) => sum + r.quantity * r.avgPrice,
    0
  );
  const totalUnrealizedPnl = totalCurrent - totalInvested;

  for (const r of enriched) {
    const current = r.quantity * (r.lastPrice || r.avgPrice);
    r.weightPct = totalCurrent > 0 ? (current / totalCurrent) * 100 : 0;
  }

  const topPositions = [...enriched]
    .sort((a, b) => b.weightPct - a.weightPct)
    .slice(0, 5);

  const diversificationNote =
    topPositions.length > 0 && topPositions[0].weightPct > 40
      ? "High concentration risk: largest position exceeds 40% of portfolio."
      : undefined;

  return {
    totalInvested: round2(totalInvested),
    totalCurrent: round2(totalCurrent),
    totalUnrealizedPnl: round2(totalUnrealizedPnl),
    topPositions,
    diversificationNote,
  };
}

function computeSimpleRecommendation(avg: number, last: number) {
  const changePct = last > 0 ? ((last - avg) / avg) * 100 : 0;
  if (changePct > 20)
    return {
      recommendation: "Hold" as const,
      rationale:
        "Strong gains; avoid chasing. Consider partial profit booking if thesis changed.",
    };
  if (changePct < -15)
    return {
      recommendation: "Hold" as const,
      rationale:
        "Significant drawdown; reassess fundamentals before averaging or exiting.",
    };
  return {
    recommendation: "Buy" as const,
    rationale: "Near average price; add gradually if fundamentals intact.",
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
