import connectMongo from "@/lib/connect-mongo";
import UsageEvent from "@/models/UsageEvent";
import type { Types } from "mongoose";

type Id = Types.ObjectId | string;
type Feature = "chat" | "vision_upload" | "portfolio_ai";

/** Fire-and-forget usage log for cost calibration (Mongo aggregate / export). */
export function logUsageEvent(
  userId: Id,
  feature: Feature,
  credits: number,
  meta?: Record<string, unknown>
): void {
  void (async () => {
    try {
      await connectMongo();
      await UsageEvent.create({
        userId,
        feature,
        credits,
        meta: meta && typeof meta === "object" ? meta : {},
      });
    } catch (e) {
      console.error("[credits logUsageEvent]", e);
    }
  })();
}
