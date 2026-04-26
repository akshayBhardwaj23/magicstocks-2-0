import type { AssetClass } from "@/lib/portfolio/types";
import { fetchZerodhaHoldings } from "./zerodha";
// import { fetchUpstoxHoldings } from "./upstox";

export type { AssetClass } from "@/lib/portfolio/types";

/** One row for portfolio math (broker API or upload pipeline) */
export type NormalizedHolding = {
  broker: "zerodha" | "upstox" | "upload";
  symbol: string;
  quantity: number;
  /** Average buy price in the row's native `currency`. */
  avgPrice: number;
  /** Last/market price in the row's native `currency`. */
  lastPrice?: number;
  pnl?: number;
  assetType?: AssetClass;
  /** ISO currency code of `avgPrice`/`lastPrice`. Defaults to "INR" when missing. */
  currency?: string;
  /**
   * Frozen copy of `avgPrice` converted to INR using `fxRate` at the time the
   * row was saved. All portfolio totals/curves read this so a USD position
   * doesn't get summed as ₹.
   */
  avgPriceInr?: number;
  /** Frozen copy of `lastPrice` converted to INR. */
  lastPriceInr?: number;
  /** Currency → INR rate used when this row was saved. INR rows = 1. */
  fxRate?: number;
};

export async function normalizeZerodhaHoldings(accessToken: string) {
  const rows = await fetchZerodhaHoldings(accessToken);
  const mapped: NormalizedHolding[] = rows.map((r: any) => {
    const avg = Number(r.average_price || r.avg_price || 0);
    const last = Number(r.last_price || r.ltp || 0);
    return {
      broker: "zerodha",
      symbol: r.tradingsymbol || r.symbol,
      quantity: Number(r.quantity || r.qty || 0),
      avgPrice: avg,
      lastPrice: last,
      assetType: "stock",
      currency: "INR",
      avgPriceInr: avg,
      lastPriceInr: last,
      fxRate: 1,
    };
  });
  return mapped;
}

// export async function normalizeUpstoxHoldings(accessToken: string) {
//   const rows = await fetchUpstoxHoldings(accessToken);
//   const mapped: NormalizedHolding[] = rows.map((r: any) => ({
//     broker: "upstox",
//     symbol: r.symbol || r.trading_symbol || r.isin,
//     quantity: Number(r.quantity || r.qty || 0),
//     avgPrice: Number(r.average_price || r.avg_price || 0) / 100,
//     lastPrice: Number(r.last_price || r.ltp || 0) / 100,
//     assetType: "stock",
//   }));
//   return mapped;
// }
