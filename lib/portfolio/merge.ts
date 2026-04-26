import type { NormalizedHolding } from "@/lib/brokers";

const norm = (s: string) => (s || "").trim().toLowerCase();

/**
 * Merge new holdings into a previous snapshot keyed by symbol (case-insensitive).
 *
 * - Symbols present in `next` overwrite the matching row in `prev` (new values
 *   are the latest truth from the user's screenshot or edit).
 * - Symbols present only in `prev` are kept as-is — we don't silently delete
 *   rows the user didn't include in this upload.
 * - Symbols present only in `next` are added.
 *
 * Insertion order: existing rows first (in their original order, with updates
 * applied in place), then any brand-new rows from `next`.
 */
export function mergeHoldings(
  prev: NormalizedHolding[] | undefined | null,
  next: NormalizedHolding[]
): NormalizedHolding[] {
  const nextMap = new Map<string, NormalizedHolding>();
  for (const h of next) nextMap.set(norm(h.symbol), h);

  const seen = new Set<string>();
  const merged: NormalizedHolding[] = [];

  for (const h of prev || []) {
    const key = norm(h.symbol);
    if (nextMap.has(key)) {
      merged.push({ ...h, ...nextMap.get(key)! });
      seen.add(key);
    } else {
      merged.push(h);
    }
  }

  for (const h of next) {
    const key = norm(h.symbol);
    if (!seen.has(key)) merged.push(h);
  }

  return merged;
}
