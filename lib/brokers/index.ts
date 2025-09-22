import { fetchZerodhaHoldings } from "./zerodha";
import { fetchUpstoxHoldings } from "./upstox";

export type NormalizedHolding = {
  broker: "zerodha" | "upstox";
  symbol: string;
  quantity: number;
  avgPrice: number;
  lastPrice?: number;
  pnl?: number;
};

export async function normalizeZerodhaHoldings(accessToken: string) {
  const rows = await fetchZerodhaHoldings(accessToken);
  const mapped: NormalizedHolding[] = rows.map((r: any) => ({
    broker: "zerodha",
    symbol: r.tradingsymbol || r.symbol,
    quantity: Number(r.quantity || r.qty || 0),
    avgPrice: Number(r.average_price || r.avg_price || 0),
    lastPrice: Number(r.last_price || r.ltp || 0),
  }));
  return mapped;
}

export async function normalizeUpstoxHoldings(accessToken: string) {
  const rows = await fetchUpstoxHoldings(accessToken);
  const mapped: NormalizedHolding[] = rows.map((r: any) => ({
    broker: "upstox",
    symbol: r.symbol || r.trading_symbol || r.isin,
    quantity: Number(r.quantity || r.qty || 0),
    // Upstox v2 often returns prices in paise; normalize to rupees
    avgPrice: Number(r.average_price || r.avg_price || 0) / 100,
    lastPrice: Number(r.last_price || r.ltp || 0) / 100,
  }));
  return mapped;
}
