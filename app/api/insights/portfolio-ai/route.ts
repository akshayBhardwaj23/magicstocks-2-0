import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/lib/connect-mongo";
import User from "@/models/User";
import BrokerConnection from "@/models/BrokerConnection";
import { normalizeZerodhaHoldings } from "@/lib/brokers";
import { perplexity } from "@/lib/customAiModel";
import { generateText } from "ai";
import { aiModelName } from "@/constants/constants";
import { computePortfolioInsights } from "@/lib/insights/portfolio";

export const runtime = "nodejs";
export const maxDuration = 30;

// ---------- Types for the UI component ----------
type UIInsights = {
  kpis: { invested: number; current: number; pnl: number };
  performance: { series: { date: string; value: number }[] };
  allocations: { label: string; percent: number }[];
  risk: {
    score: number;
    topHolding: number;
    top3: number;
    sectorOverlap: number;
    beta: number;
  };
  movers: {
    winners: {
      symbol: string;
      name: string;
      change: string;
      weight: number;
      pnl: number;
    }[];
    losers: {
      symbol: string;
      name: string;
      change: string;
      weight: number;
      pnl: number;
    }[];
  };
  actions: string[];
  notes: string[];
  events: {
    date: string;
    symbol: string;
    company: string;
    title: string;
    impact: "Low" | "Medium" | "High";
  }[];
};

type Holding = {
  broker: "zerodha" | "upstox";
  symbol: string;
  quantity: number;
  avgPrice: number;
  lastPrice?: number;
};

// ---------- Helpers to shape UI data ----------
function toINR(n: number) {
  return Number.isFinite(n) ? n : 0;
}

function buildUIData(holdings: Holding[], insights: any): UIInsights {
  // current value per holding
  const rows = holdings.map((h) => {
    const last = toINR(h.lastPrice ?? 0);
    const curVal = last * h.quantity;
    const invVal = toINR(h.avgPrice) * h.quantity;
    const pnl = curVal - invVal;
    const pnlPct = invVal > 0 ? (pnl / invVal) * 100 : 0;
    return { ...h, curVal, invVal, pnl, pnlPct };
  });

  const totalInvested = rows.reduce((s, r) => s + r.invVal, 0);
  const totalCurrent = rows.reduce((s, r) => s + r.curVal, 0);
  const totalPnl = totalCurrent - totalInvested;

  // allocations by symbol (% of current value)
  const allocations = rows
    .sort((a, b) => b.curVal - a.curVal)
    .map((r) => ({
      label: r.symbol,
      percent: totalCurrent > 0 ? (r.curVal / totalCurrent) * 100 : 0,
    }))
    .slice(0, 8); // keep it tidy; you can group the rest as "Others" if you like

  // concentration (fallbacks if your computePortfolioInsights doesn’t include)
  const weights = rows
    .map((r) => (totalCurrent > 0 ? r.curVal / totalCurrent : 0))
    .sort((a, b) => b - a);
  const top1 = weights[0] ?? 0;
  const top3 = (weights[0] ?? 0) + (weights[1] ?? 0) + (weights[2] ?? 0);

  // very light heuristic risk score: concentration + small diversification factor
  // (replace with your own when you add sector overlap/beta)
  const sectorOverlap = Number(insights?.sectorOverlap ?? 0.5); // unknown for now: assume mid overlap
  const beta = Number(insights?.beta ?? 1);
  const riskScore = Math.max(
    0,
    Math.min(
      1,
      0.45 * top3 +
        0.25 * top1 +
        0.15 * sectorOverlap +
        0.15 * Math.max(0, Math.min(1, (beta - 0.8) / 0.6))
    )
  );

  // winners / losers (use your computePortfolioInsights if available; else compute here)
  const sortedByPct = [...rows].filter((r) => Number.isFinite(r.pnlPct));
  const winners = sortedByPct.sort((a, b) => b.pnlPct - a.pnlPct).slice(0, 5);
  const losers = sortedByPct.sort((a, b) => a.pnlPct - b.pnlPct).slice(0, 5);

  // map for UI component
  const uiWinners = winners.map((w) => ({
    symbol: w.symbol,
    name: w.symbol,
    change: `+${w.pnlPct.toFixed(1)}%`,
    weight: totalCurrent > 0 ? w.curVal / totalCurrent : 0,
    pnl: w.pnl,
  }));
  const uiLosers = losers.map((l) => ({
    symbol: l.symbol,
    name: l.symbol,
    change: `${l.pnlPct.toFixed(1)}%`,
    weight: totalCurrent > 0 ? l.curVal / totalCurrent : 0,
    pnl: l.pnl,
  }));

  // actions / notes from your existing computed insights (plus guardrails)
  const actions: string[] = [];
  const notes: string[] = [];

  const conc = insights?.concentration ?? {};
  if ((conc.top1Pct ?? top1 * 100) > 30) {
    actions.push("Trim the top holding to bring concentration below 30%.");
  }
  if ((conc.top3Pct ?? top3 * 100) > 60) {
    actions.push("Rebalance top 3 holdings to reduce drawdown risk.");
  }
  if (allocations.length < 5) {
    notes.push(
      "Portfolio breadth is low; consider adding diversified names/ETFs."
    );
  }
  if (riskScore >= 0.66)
    notes.push(
      "Overall risk is high; prioritize diversification and position sizing."
    );

  // events (placeholder – populate from your earnings/dividend feed later)
  const events: UIInsights["events"] = [];

  // equity curve (placeholder – if you don’t have history yet, show a simple 2-point curve)
  const performance = {
    series: [
      { date: "Start", value: Math.max(0, totalInvested) },
      { date: "Now", value: Math.max(0, totalCurrent) },
    ],
  };

  return {
    kpis: { invested: totalInvested, current: totalCurrent, pnl: totalPnl },
    performance,
    allocations,
    risk: { score: riskScore, topHolding: top1, top3, sectorOverlap, beta },
    movers: { winners: uiWinners, losers: uiLosers },
    actions,
    notes,
    events,
  };
}

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

    // fetch holdings from connected brokers
    const tasks: Promise<Holding[]>[] = conns.map((conn: any) => {
      if (conn.broker === "zerodha" && conn.accessToken) {
        return normalizeZerodhaHoldings(conn.accessToken) as Promise<any>;
      }
      return Promise.resolve([]);
    });

    const settled = await Promise.allSettled(tasks);
    const allHoldings: Holding[] = [];
    for (const s of settled) {
      if (s.status === "fulfilled" && Array.isArray(s.value))
        allHoldings.push(...(s.value as any));
    }

    // your existing numeric insights (kept as-is)
    const insights = computePortfolioInsights(allHoldings as any);

    // ---------- NEW: build the UI payload ----------
    const ui: UIInsights = buildUIData(allHoldings, insights);
    if (ui.actions.length === 0) {
      ui.actions.push(
        "Review position sizing and rebalance if any single stock exceeds 25–30% weight."
      );
    }
    if (ui.notes.length === 0) {
      ui.notes.push(
        "No major risks detected by the model. Continue monitoring earnings and sector rotation."
      );
    }

    // ---------- Projection via AI-assisted CAGR (low/mid/high) ----------
    const invested = ui.kpis.invested || 0;
    const current = ui.kpis.current || 0;
    let cagr = { low: 8, mid: 12, high: 16 };
    try {
      const projPrompt = `You are a financial analyst. Based on the following portfolio snapshot, estimate reasonable CAGR percentages for the next decade for a diversified Indian equity portfolio.

Only output strict JSON with integer percentages and no extra text, in this shape:
{"cagr_low":10,"cagr_mid":12,"cagr_high":15}

Snapshot:
Invested: ₹${Math.round(invested)}
Current: ₹${Math.round(current)}
Top positions (symbol: weight%): ${(insights.topPositions || [])
        .map((p: any) => `${p.symbol}:${Number(p.weightPct || 0).toFixed(0)}%`)
        .join(", ")}
Diversification note: ${insights.diversificationNote || "none"}`;
      const projResult = await Promise.race([
        generateText({
          model: perplexity(aiModelName),
          system:
            "You output only strict JSON when asked. No prose, no backticks.",
          prompt: projPrompt,
          maxTokens: 60,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 5000)
        ),
      ]);
      const projText = (projResult as any)?.text ?? "";
      try {
        const parsed = JSON.parse(projText);
        const low = Number(parsed?.cagr_low);
        const mid = Number(parsed?.cagr_mid);
        const high = Number(parsed?.cagr_high);
        if (
          Number.isFinite(low) &&
          Number.isFinite(mid) &&
          Number.isFinite(high)
        ) {
          cagr = { low, mid, high } as any;
        }
      } catch {}
    } catch {}

    function projectFV(present: number, pct: number, years: number) {
      return present * Math.pow(1 + pct / 100, years);
    }

    const value5y = {
      low: Math.round(projectFV(current, cagr.low, 5)),
      mid: Math.round(projectFV(current, cagr.mid, 5)),
      high: Math.round(projectFV(current, cagr.high, 5)),
    };
    const value10y = {
      low: Math.round(projectFV(current, cagr.low, 10)),
      mid: Math.round(projectFV(current, cagr.mid, 10)),
      high: Math.round(projectFV(current, cagr.high, 10)),
    };

    (ui as any).projection = { cagr, value5y, value10y };

    // ---------- AI text analysis (kept, but we’ll return alongside UI) ----------
    const prompt = `You are a professional financial analyst. Analyze the user’s stock portfolio based on the following data:

[Holdings]
${JSON.stringify(
  (allHoldings as any[]).map((h) => ({
    broker: h.broker,
    symbol: h.symbol,
    quantity: h.quantity,
    avgPrice: h.avgPrice,
    lastPrice: h.lastPrice,
  }))
).slice(0, 4000)}

[Portfolio Insights]
${JSON.stringify(
  {
    totalInvested: insights.totalInvested,
    totalCurrent: insights.totalCurrent,
    totalUnrealizedPnl: insights.totalUnrealizedPnl,
    concentration: insights.concentration,
    brokerAllocation: insights.brokerAllocation,
    topPositions: (insights.topPositions || []).map((p: any) => ({
      broker: p.broker,
      symbol: p.symbol,
      weightPct: Number(p.weightPct?.toFixed?.(1) || p.weightPct || 0),
      recommendation: p.recommendation,
    })),
    winners: (insights.winners || []).map((w: any) => ({
      broker: w.broker,
      symbol: w.symbol,
      pnlPct: Number((w.pnlPct ?? 0).toFixed(1)),
    })),
    losers: (insights.losers || []).map((l: any) => ({
      broker: l.broker,
      symbol: l.symbol,
      pnlPct: Number((l.pnlPct ?? 0).toFixed(1)),
    })),
    diversificationNote: insights.diversificationNote,
  },
  null,
  0
).slice(0, 4000)}

Your task:
1. Performance Overview – Summarize overall portfolio health.
2. Risk & Diversification – Assess diversification & concentration risks.
3. Winners & Losers – Identify strongest and weakest stocks with reasoning.
4. Opportunities & Risks Ahead – Balanced risks/opportunities.
5. Actionable Insights – Practical steps (rebalancing, trimming, diversification).
6. Tone – Concise, retail-friendly. Use ₹ for amounts; mark positives with ✅ and negatives with ⚠️.

Output:
- 2–3 line executive summary
- Sections: Performance, Diversification, Winners & Losers, Opportunities, Recommendations
- Conclude with a verdict (healthy / risky / needs adjustments).`;

    let text = "";
    try {
      const result = await Promise.race([
        generateText({
          model: perplexity(aiModelName),
          system:
            "You analyze Indian equities in NSE/BSE and speak concisely in bullet points.",
          prompt,
          maxTokens: 600,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 15000)
        ),
      ]);
      text = (result as any)?.text ?? "";
    } catch (aiErr) {
      // Best-effort: still return UI payload even if text generation failed
      console.warn(
        "[insights/portfolio-ai] AI generation failed, returning UI only",
        aiErr
      );
      text = "";
    }

    // ---------- Return BOTH text and UI payload ----------
    return NextResponse.json({ text, ui });
  } catch (error) {
    console.error("[insights/portfolio-ai] failed to generate analysis", error);
    return NextResponse.json(
      { message: "Failed to generate analysis" },
      { status: 502 }
    );
  }
}
