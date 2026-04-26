import type { NormalizedHolding } from "@/lib/brokers";
import type { AssetClass } from "@/lib/portfolio/types";
import { z } from "zod";

const rowSchema = z.object({
  assetName: z.string(),
  assetType: z.enum([
    "stock",
    "etf",
    "mutual_fund",
    "foreign_stock",
    "gold_bond",
    "debt",
    "other",
  ]),
  symbolOrIsin: z.string().optional(),
  quantity: z.number().nonnegative(),
  averagePrice: z.number().nonnegative().optional(),
  currentPrice: z.number().nonnegative().optional(),
  /** Total line value if visible (we can infer price * qty if needed) */
  currentValue: z.number().nonnegative().optional(),
  currency: z.string().optional(),
});

const responseSchema = z.object({
  holdings: z.array(rowSchema),
  notes: z.string().optional(),
});

export type ParsedScreenshotResponse = z.infer<typeof responseSchema>;

const SYSTEM = `You extract investment holdings from screenshots (broker apps, CAMS, Coin, bank statements, Excel exports, etc.).
Classify each line into assetType: stock, etf, mutual_fund, foreign_stock, gold_bond, debt, or other.
Use quantity in natural units: shares for equities, units for mutual funds, grams for gold if shown, else units.
If only current value is visible for a line, set currentValue and quantity=1 and averagePrice=currentValue.
Prices and values: use the same currency as on screen (usually INR); if US stock, set currency USD and assetType foreign_stock.
Return strict JSON only, no markdown.`;

/**
 * Call OpenAI vision API. Requires OPENAI_API_KEY.
 */
export async function parseHoldingsFromScreenshots(
  images: { base64: string; mimeType: string }[]
): Promise<{ holdings: NormalizedHolding[]; notes?: string }> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const content: Array<
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string; detail?: "low" | "high" | "auto" } }
  > = [
    {
      type: "text",
      text: `${SYSTEM}

Return JSON with this exact shape:
{"holdings":[{"assetName":"string","assetType":"stock|etf|mutual_fund|foreign_stock|gold_bond|debt|other","symbolOrIsin":"optional","quantity":0,"averagePrice":0,"currentPrice":0,"currentValue":0,"currency":"INR"}],"notes":"optional short note if something was unclear"}`,
    },
  ];

  for (const img of images) {
    const dataUrl = `data:${img.mimeType};base64,${img.base64}`;
    content.push({
      type: "image_url",
      image_url: { url: dataUrl, detail: "high" },
    });
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_VISION_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content }],
      temperature: 0.1,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[parseScreenshots] OpenAI error", res.status, errText);
    throw new Error(`Vision model error: ${res.status}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty model response");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Model did not return valid JSON");
  }

  const validated = responseSchema.safeParse(parsed);
  if (!validated.success) {
    console.error("[parseScreenshots] zod", validated.error.flatten());
    throw new Error("Could not parse holdings structure from image");
  }

  const holdings = validated.data.holdings.map(toNormalized);
  return { holdings, notes: validated.data.notes };
}

function toNormalized(row: z.infer<typeof rowSchema>): NormalizedHolding {
  const raw =
    [row.symbolOrIsin?.trim(), row.assetName.trim()].filter(Boolean).join(" · ") ||
    "Holding";
  const label = raw.length > 120 ? raw.slice(0, 117) + "..." : raw;
  let quantity = row.quantity;
  let avgPrice = row.averagePrice ?? 0;
  let lastPrice = row.currentPrice;

  if (
    row.currentValue != null &&
    row.currentValue > 0 &&
    quantity > 0 &&
    (avgPrice === 0 || lastPrice == null)
  ) {
    const perUnit = row.currentValue / quantity;
    if (avgPrice === 0) avgPrice = perUnit;
    if (lastPrice == null || lastPrice === 0) lastPrice = perUnit;
  }

  if (quantity === 0 && row.currentValue != null && row.currentValue > 0) {
    quantity = 1;
    avgPrice = row.currentValue;
    lastPrice = row.currentValue;
  }

  return {
    broker: "upload",
    symbol: label,
    quantity,
    avgPrice,
    lastPrice: lastPrice ?? avgPrice,
    assetType: row.assetType as AssetClass,
    currency: row.currency || "INR",
  };
}
