/**
 * Tiny FX helper. Resolves "rate to INR" for any currency code.
 *
 * Order of precedence:
 *   1. In-memory cache (12h TTL).
 *   2. Frankfurter API (free, no auth).
 *   3. FX_<CCY>_INR env var (e.g. FX_USD_INR=83.5) — explicit override.
 *   4. Hardcoded fallback table.
 *
 * INR is always 1.
 */

const TTL_MS = 12 * 60 * 60 * 1000; // 12h

const cache: Map<string, { rate: number; fetchedAt: number }> = new Map();

const FALLBACK: Record<string, number> = {
  INR: 1,
  USD: 83,
  EUR: 90,
  GBP: 105,
  AED: 22.6,
  SGD: 61,
  AUD: 55,
  CAD: 60,
  JPY: 0.55,
  CHF: 95,
  HKD: 10.6,
};

const norm = (c: string) => (c || "INR").trim().toUpperCase();

function envRate(currency: string): number | null {
  const key = `FX_${currency}_INR`;
  const raw = process.env[key];
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function fallbackRate(currency: string): number {
  return FALLBACK[currency] ?? 1;
}

async function fetchFromFrankfurter(currency: string): Promise<number | null> {
  try {
    const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(
      currency
    )}&to=INR`;
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 12 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { rates?: { INR?: number } };
    const rate = json?.rates?.INR;
    return Number.isFinite(rate) && rate! > 0 ? (rate as number) : null;
  } catch {
    return null;
  }
}

/** Return INR rate for one currency, using cache + remote + env + fallback. */
export async function getInrRate(currency: string): Promise<number> {
  const ccy = norm(currency);
  if (ccy === "INR") return 1;

  const hit = cache.get(ccy);
  const now = Date.now();
  if (hit && now - hit.fetchedAt < TTL_MS) return hit.rate;

  const env = envRate(ccy);
  if (env != null) {
    cache.set(ccy, { rate: env, fetchedAt: now });
    return env;
  }

  const remote = await fetchFromFrankfurter(ccy);
  if (remote != null) {
    cache.set(ccy, { rate: remote, fetchedAt: now });
    return remote;
  }

  const fb = fallbackRate(ccy);
  cache.set(ccy, { rate: fb, fetchedAt: now });
  return fb;
}

/** Resolve a map of {ccy: rate-to-INR} for the unique non-INR currencies. */
export async function getInrRatesFor(
  currencies: Iterable<string>
): Promise<Record<string, number>> {
  const unique = new Set<string>();
  for (const c of currencies) unique.add(norm(c));
  unique.add("INR");

  const entries = await Promise.all(
    Array.from(unique).map(async (c) => [c, await getInrRate(c)] as const)
  );
  return Object.fromEntries(entries);
}
