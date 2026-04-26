import type { NormalizedHolding } from "@/lib/brokers";

type PortfolioContextOptions = {
  holdings: NormalizedHolding[];
  asOf?: Date | string | null;
  dataSource?: "screenshot" | "broker" | "none";
  insights?: {
    totalInvested?: number;
    totalCurrent?: number;
    totalUnrealizedPnl?: number;
    concentration?: { top1Pct?: number; top3Pct?: number };
    diversificationNote?: string;
  } | null;
};

const MAX_ROWS = 60;
const MAX_CHARS = 16000;

function inrAvg(h: NormalizedHolding): number {
  if (h.avgPriceInr != null && Number.isFinite(Number(h.avgPriceInr))) {
    return Number(h.avgPriceInr);
  }
  return Number(h.avgPrice) || 0;
}

function inrLast(h: NormalizedHolding): number {
  if (h.lastPriceInr != null && Number.isFinite(Number(h.lastPriceInr))) {
    return Number(h.lastPriceInr);
  }
  if (h.lastPrice != null && Number.isFinite(Number(h.lastPrice))) {
    return Number(h.lastPrice);
  }
  return inrAvg(h);
}

function money(n: number): string {
  if (!Number.isFinite(n)) return "0.00";
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function short(s: string, max = 48): string {
  const v = String(s || "").trim();
  if (v.length <= max) return v;
  return `${v.slice(0, max - 1)}…`;
}

function fmtDate(value?: Date | string | null): string {
  if (!value) return "unknown";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "unknown";
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function buildPortfolioChatContext({
  holdings,
  asOf,
  dataSource,
  insights,
}: PortfolioContextOptions): string {
  const rows = holdings.map((h) => {
    const qty = Number(h.quantity) || 0;
    const current = inrLast(h) * qty;
    const invested = inrAvg(h) * qty;
    const ccy = (h.currency || "INR").toUpperCase();
    return {
      symbol: h.symbol || "UNKNOWN",
      qty,
      avg: Number(h.avgPrice) || 0,
      last:
        h.lastPrice != null && Number.isFinite(Number(h.lastPrice))
          ? Number(h.lastPrice)
          : Number(h.avgPrice) || 0,
      ccy,
      invested,
      current,
      avgInr: inrAvg(h),
      lastInr: inrLast(h),
      assetType: h.assetType || "other",
    };
  });

  const totalCurrentFromRows = rows.reduce((s, r) => s + r.current, 0);
  const totalInvestedFromRows = rows.reduce((s, r) => s + r.invested, 0);
  const totalCurrent = Number(insights?.totalCurrent ?? totalCurrentFromRows) || 0;
  const totalInvested =
    Number(insights?.totalInvested ?? totalInvestedFromRows) || 0;
  const totalPnl =
    Number(insights?.totalUnrealizedPnl ?? totalCurrent - totalInvested) || 0;

  const sorted = [...rows].sort((a, b) => b.current - a.current);
  const limited = sorted.slice(0, MAX_ROWS);
  const omitted = Math.max(0, sorted.length - limited.length);

  const lines: string[] = [];
  lines.push("PORTFOLIO_CONTEXT");
  lines.push(`As-of: ${fmtDate(asOf)}`);
  lines.push(`Source: ${dataSource || "unknown"}`);
  lines.push(`Rows: ${rows.length}`);
  lines.push("Base currency: INR");
  lines.push(
    `Totals (INR): invested=${money(totalInvested)}, current=${money(
      totalCurrent
    )}, unrealized_pnl=${money(totalPnl)}`
  );

  const top1 = insights?.concentration?.top1Pct;
  const top3 = insights?.concentration?.top3Pct;
  if (Number.isFinite(top1 as number) || Number.isFinite(top3 as number)) {
    lines.push(
      `Concentration: top1=${Number(top1 || 0).toFixed(1)}%, top3=${Number(
        top3 || 0
      ).toFixed(1)}%`
    );
  }
  if (insights?.diversificationNote) {
    lines.push(`Diversification_note: ${short(insights.diversificationNote, 220)}`);
  }

  lines.push("");
  lines.push(
    "Holdings table: symbol | qty | avg_native | last_native | avg_inr | last_inr | weight_pct | asset_type"
  );

  for (const r of limited) {
    const weight = totalCurrent > 0 ? (r.current / totalCurrent) * 100 : 0;
    lines.push(
      `${short(r.symbol)} | ${r.qty} | ${money(r.avg)} ${r.ccy} | ${money(
        r.last
      )} ${r.ccy} | ${money(r.avgInr)} INR | ${money(
        r.lastInr
      )} INR | ${weight.toFixed(2)} | ${r.assetType}`
    );
  }

  if (omitted > 0) {
    lines.push(`... ${omitted} additional rows omitted for brevity.`);
  }

  let out = lines.join("\n");
  if (out.length > MAX_CHARS) {
    out = out.slice(0, MAX_CHARS - 32) + "\n... context truncated for length.";
  }
  return out;
}
