import type { NormalizedHolding } from "@/lib/brokers";
import { getInrRatesFor } from "./fx";

const norm = (c?: string) => (c || "INR").trim().toUpperCase();

/**
 * Stamp every row with `avgPriceInr` / `lastPriceInr` / `fxRate`.
 *
 * Rules:
 * - INR rows always get `fxRate = 1` and Inr fields = original prices.
 * - Foreign rows get the latest cached rate from `getInrRatesFor`.
 * - The row's own `currency` is preserved as the "native" currency for display.
 *
 * This is the single conversion choke point. Insights/totals downstream read
 * `*Inr` fields so they don't accidentally sum mixed currencies.
 */
export async function applyFxToHoldings(
  rows: NormalizedHolding[]
): Promise<NormalizedHolding[]> {
  if (!rows.length) return rows;

  const currencies = rows.map((r) => norm(r.currency));
  const rates = await getInrRatesFor(currencies);

  return rows.map((r) => {
    const ccy = norm(r.currency);
    const rate = rates[ccy] ?? 1;
    const avg = Number(r.avgPrice) || 0;
    const last =
      r.lastPrice != null && Number.isFinite(Number(r.lastPrice))
        ? Number(r.lastPrice)
        : avg;
    return {
      ...r,
      currency: ccy,
      fxRate: rate,
      avgPriceInr: round4(avg * rate),
      lastPriceInr: round4(last * rate),
    };
  });
}

/**
 * Synchronous fallback: when we already have FX rates baked in OR everything
 * is INR, return rows with `*Inr` fields populated without an async fetch.
 * Used at read-time as a defensive measure for legacy snapshots.
 */
export function applyFxFallback(
  rows: NormalizedHolding[]
): NormalizedHolding[] {
  return rows.map((r) => {
    const ccy = norm(r.currency);
    const isInr = ccy === "INR";
    const fxRate =
      r.fxRate != null && Number.isFinite(r.fxRate) ? r.fxRate : isInr ? 1 : 1;
    const avg = Number(r.avgPrice) || 0;
    const last =
      r.lastPrice != null && Number.isFinite(Number(r.lastPrice))
        ? Number(r.lastPrice)
        : avg;
    return {
      ...r,
      currency: ccy,
      fxRate,
      avgPriceInr:
        r.avgPriceInr != null ? Number(r.avgPriceInr) : round4(avg * fxRate),
      lastPriceInr:
        r.lastPriceInr != null ? Number(r.lastPriceInr) : round4(last * fxRate),
    };
  });
}

function round4(n: number) {
  return Math.round(n * 10000) / 10000;
}
