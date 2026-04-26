import type { AssetClass } from "@/lib/portfolio/types";
import { fetchZerodhaHoldings } from "./zerodha";
// import { fetchUpstoxHoldings } from "./upstox";

export type { AssetClass } from "@/lib/portfolio/types";

/** One row for portfolio math (broker API or upload pipeline) */
export type NormalizedHolding = {
  broker: "zerodha" | "upstox" | "upload";
  symbol: string;
  quantity: number;
  avgPrice: number;
  lastPrice?: number;
  pnl?: number;
  assetType?: AssetClass;
  currency?: string;
};

export async function normalizeZerodhaHoldings(accessToken: string) {
  const rows = await fetchZerodhaHoldings(accessToken);
  const mapped: NormalizedHolding[] = rows.map((r: any) => ({
    broker: "zerodha",
    symbol: r.tradingsymbol || r.symbol,
    quantity: Number(r.quantity || r.qty || 0),
    avgPrice: Number(r.average_price || r.avg_price || 0),
    lastPrice: Number(r.last_price || r.ltp || 0),
    assetType: "stock",
  }));
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
