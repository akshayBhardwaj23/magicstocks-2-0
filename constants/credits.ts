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
export const PACK_STARTER_INR = ni("PACK_STARTER_INR", 99);

/** Pack: Pro — INR price. */
export const PACK_PRO_INR = ni("PACK_PRO_INR", 799);

/** Credits granted on Starter purchase. */
export const PACK_STARTER_CREDITS = ni("PACK_STARTER_CREDITS", 20);

/**
 * Credits granted on Pro purchase. Lower if you need higher ₹/credit after fees.
 * Default 300 matches historical product.
 */
export const PACK_PRO_CREDITS = ni("PACK_PRO_CREDITS", 300);

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
