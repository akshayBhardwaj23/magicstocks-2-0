import { NextResponse } from "next/server";
import {
  getCreditPacks,
  getStarterSaleDisplay,
  getProSaleDisplay,
  getPackPromoLabel,
  CREDIT_COST_CHAT,
  CREDIT_COST_VISION_PER_IMAGE,
  CREDIT_COST_PORTFOLIO_AI,
} from "@/constants/credits";

/** Public config for UI: pack prices/credits, sale vs list (marketing), and per-action costs. */
export function GET() {
  return NextResponse.json({
    packs: getCreditPacks(),
    costs: {
      chat: CREDIT_COST_CHAT,
      visionPerImage: CREDIT_COST_VISION_PER_IMAGE,
      portfolioAi: CREDIT_COST_PORTFOLIO_AI,
    },
    display: {
      promoLabel: getPackPromoLabel(),
      starter: getStarterSaleDisplay(),
      pro: getProSaleDisplay(),
    },
  });
}
