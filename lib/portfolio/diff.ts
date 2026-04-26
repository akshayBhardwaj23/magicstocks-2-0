import type { NormalizedHolding } from "@/lib/brokers";

export type HoldingDiff = {
  added: { symbol: string; quantity: number }[];
  removed: { symbol: string; quantity: number }[];
  changed: {
    symbol: string;
    quantityDelta: number;
    avgPriceDelta: number;
  }[];
  unchanged: number;
  /** total rows in the new snapshot */
  total: number;
};

const norm = (s: string) => (s || "").trim().toLowerCase();

/**
 * Compare two holdings lists by symbol (case-insensitive). Differences in
 * quantity or avg price are flagged as "changed"; identical rows count as
 * unchanged.
 */
export function diffHoldings(
  prev: NormalizedHolding[] | undefined | null,
  next: NormalizedHolding[]
): HoldingDiff {
  const result: HoldingDiff = {
    added: [],
    removed: [],
    changed: [],
    unchanged: 0,
    total: next.length,
  };

  const prevMap = new Map<string, NormalizedHolding>();
  for (const h of prev || []) prevMap.set(norm(h.symbol), h);

  const nextMap = new Map<string, NormalizedHolding>();
  for (const h of next) nextMap.set(norm(h.symbol), h);

  for (const [key, h] of nextMap) {
    const before = prevMap.get(key);
    if (!before) {
      result.added.push({ symbol: h.symbol, quantity: h.quantity });
      continue;
    }
    const qtyDelta = (h.quantity || 0) - (before.quantity || 0);
    const avgDelta = (h.avgPrice || 0) - (before.avgPrice || 0);
    if (Math.abs(qtyDelta) > 0.0001 || Math.abs(avgDelta) > 0.0001) {
      result.changed.push({
        symbol: h.symbol,
        quantityDelta: qtyDelta,
        avgPriceDelta: avgDelta,
      });
    } else {
      result.unchanged += 1;
    }
  }

  for (const [key, h] of prevMap) {
    if (!nextMap.has(key)) {
      result.removed.push({ symbol: h.symbol, quantity: h.quantity });
    }
  }

  return result;
}

export function summarizeDiff(d: HoldingDiff): string {
  const parts: string[] = [];
  if (d.added.length) parts.push(`+${d.added.length} added`);
  if (d.removed.length) parts.push(`${d.removed.length} removed`);
  if (d.changed.length) parts.push(`${d.changed.length} updated`);
  if (parts.length === 0)
    return d.total > 0 ? "No changes vs your last snapshot" : "Empty snapshot";
  return parts.join(" · ");
}
