import { NormalizedHolding } from "@/lib/brokers";

/** Educational note only — not buy/sell/hold advice */
export type HoldingInsight = NormalizedHolding & {
  weightPct: number;
  unrealizedPnl?: number;
  pnlPct?: number;
  /** Short factual/educational line (price vs cost context, not a trade call) */
  educationalNote: string;
};

export type PortfolioInsights = {
  totalInvested: number;
  totalCurrent: number;
  totalUnrealizedPnl: number;
  topPositions: HoldingInsight[];
  diversificationNote?: string;
  concentration?: {
    top1Pct: number;
    top2Pct: number;
    top3Pct: number;
  };
  winners?: HoldingInsight[]; // top by pnlPct
  losers?: HoldingInsight[]; // bottom by pnlPct
  brokerAllocation?: { [broker: string]: number }; // % by broker
};

export function computePortfolioInsights(
  holdings: NormalizedHolding[]
): PortfolioInsights {
  const enriched: HoldingInsight[] = holdings.map((h) => {
    const invested = h.quantity * h.avgPrice;
    const current = h.quantity * (h.lastPrice || h.avgPrice);
    const unrealized = current - invested;
    const pct =
      h.avgPrice > 0
        ? (((h.lastPrice || h.avgPrice) - h.avgPrice) / h.avgPrice) * 100
        : 0;
    const educationalNote = buildEducationalNote(
      h.avgPrice,
      h.lastPrice || h.avgPrice,
      pct
    );
    return {
      ...h,
      unrealizedPnl: unrealized,
      pnlPct: pct,
      educationalNote,
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
      ? "For context: the largest position is above 40% of portfolio value; educational materials often discuss this as a high level of position concentration to be aware of."
      : undefined;

  const concentration = computeConcentration(enriched);
  const winners = [...enriched]
    .filter((e) => typeof e.pnlPct === "number")
    .sort((a, b) => (b.pnlPct || 0) - (a.pnlPct || 0))
    .slice(0, 3);
  const losers = [...enriched]
    .filter((e) => typeof e.pnlPct === "number")
    .sort((a, b) => (a.pnlPct || 0) - (b.pnlPct || 0))
    .slice(0, 3);

  const brokerAllocation = enriched.reduce((acc: Record<string, number>, r) => {
    acc[r.broker] = (acc[r.broker] || 0) + r.weightPct;
    return acc;
  }, {});

  return {
    totalInvested: round2(totalInvested),
    totalCurrent: round2(totalCurrent),
    totalUnrealizedPnl: round2(totalUnrealizedPnl),
    topPositions,
    diversificationNote,
    concentration,
    winners,
    losers,
    brokerAllocation,
  };
}

/**
 * Price vs cost context for learning; explicitly not trading instruction.
 */
function buildEducationalNote(avg: number, last: number, changePct: number) {
  if (changePct > 20) {
    return "Last price is well above your average cost in this data set—a pattern people sometimes review against their own plan (not a suggestion to buy or sell).";
  }
  if (changePct < -15) {
    return "Last price is well below your average cost in this data set—factors to study include fundamentals and news, not a suggestion to add or exit.";
  }
  return "Last price is in a moderate range compared to your average cost in this data set—one input among many in portfolio learning.";
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function computeConcentration(rows: HoldingInsight[]) {
  const sorted = [...rows].sort((a, b) => b.weightPct - a.weightPct);
  const top1Pct = round2(sumPct(sorted, 1));
  const top2Pct = round2(sumPct(sorted, 2));
  const top3Pct = round2(sumPct(sorted, 3));
  return { top1Pct, top2Pct, top3Pct };
}

function sumPct(rows: HoldingInsight[], n: number) {
  return rows.slice(0, n).reduce((s, r) => s + (r.weightPct || 0), 0);
}
