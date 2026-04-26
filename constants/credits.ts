/**
 * Credit-based pricing. Override via env for repricing without code changes.
 * See README for margin tuning guidance.
 */
function n(key: string, def: number): number {
  const v = process.env[key];
  if (v == null || v === "") return def;
  const x = Number(v);
  return Number.isFinite(x) && x >= 0 ? x : def;
}

function ni(key: string, def: number): number {
  const x = n(key, def);
  return Math.max(0, Math.floor(x));
}

/** 1 = one completed chat (unchanged). */
export const CREDIT_COST_CHAT = ni("CREDIT_COST_CHAT", 1);

/** Credits per image in a single portfolio screenshot upload. */
export const CREDIT_COST_VISION_PER_IMAGE = ni("CREDIT_COST_VISION_PER_IMAGE", 1);

/** One “Run portfolio AI” action (multi-call Perplexity in portfolio-ai). */
export const CREDIT_COST_PORTFOLIO_AI = ni("CREDIT_COST_PORTFOLIO_AI", 2);

/** Manual snapshot PATCH stays free (cheap DB; good UX). */
export const CREDIT_COST_SNAPSHOT_PATCH = 0;

/** Pack: Starter — INR price (Razorpay). */
export const PACK_STARTER_INR = ni("PACK_STARTER_INR", 199);

/** Pack: Pro — INR price. */
export const PACK_PRO_INR = ni("PACK_PRO_INR", 799);

/**
 * Credits granted on Starter purchase. At default ₹199/40, gross ₹/credit ≈ same as
 * legacy ₹99/20 (~₹5), so entry economics stay familiar while list price is higher.
 */
export const PACK_STARTER_CREDITS = ni("PACK_STARTER_CREDITS", 40);

/**
 * Pro: lower gross ₹/credit than Starter. Default 250 @ ₹799 — tune via env.
 */
export const PACK_PRO_CREDITS = ni("PACK_PRO_CREDITS", 250);

/**
 * “Was” / list price in INR (marketing only; Razorpay still charges `PACK_*_INR`).
 * If list ≤ sale, UI hides the strikethrough. Override with env to turn off: set
 * `PACK_STARTER_LIST_INR=0` and `PACK_PRO_LIST_INR=0` or equal to sale.
 */
export const PACK_STARTER_LIST_INR = ni("PACK_STARTER_LIST_INR", 299);
export const PACK_PRO_LIST_INR = ni("PACK_PRO_LIST_INR", 999);

export type SaleDisplay = {
  saleInr: number;
  listInr: number | null;
  savingsInr: number | null;
  percentOff: number | null;
};

function saleDisplay(sale: number, list: number): SaleDisplay {
  if (!Number.isFinite(list) || list <= 0 || list <= sale) {
    return {
      saleInr: sale,
      listInr: null,
      savingsInr: null,
      percentOff: null,
    };
  }
  const savings = list - sale;
  const percentOff = Math.max(0, Math.round((savings / list) * 100));
  return { saleInr: sale, listInr: list, savingsInr: savings, percentOff };
}

export function getStarterSaleDisplay(): SaleDisplay {
  return saleDisplay(PACK_STARTER_INR, PACK_STARTER_LIST_INR);
}

export function getProSaleDisplay(): SaleDisplay {
  return saleDisplay(PACK_PRO_INR, PACK_PRO_LIST_INR);
}

/** Marketing line for both packs (e.g. banner badge). */
export function getPackPromoLabel(): string {
  return (process.env.PACK_PROMO_LABEL || "Launch offer").trim() || "Launch offer";
}

export type CreditPacks = {
  starter: { rupees: number; credits: number };
  pro: { rupees: number; credits: number };
};

export function getCreditPacks(): CreditPacks {
  return {
    starter: { rupees: PACK_STARTER_INR, credits: PACK_STARTER_CREDITS },
    pro: { rupees: PACK_PRO_INR, credits: PACK_PRO_CREDITS },
  };
}
