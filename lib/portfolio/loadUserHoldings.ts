import type { NormalizedHolding } from "@/lib/brokers";
import { normalizeZerodhaHoldings } from "@/lib/brokers";
import BrokerConnection from "@/models/BrokerConnection";
import PortfolioSnapshot from "@/models/PortfolioSnapshot";
import type { Types } from "mongoose";

export type HoldingsLoadResult = {
  holdings: NormalizedHolding[];
  /** Where the primary table data came from */
  dataSource: "screenshot" | "broker" | "none";
  failures: string[];
  parseNotes?: string;
};

/**
 * Prefer the latest screenshot-derived snapshot when it has rows; otherwise broker APIs.
 */
export async function loadHoldingsForUser(
  userId: Types.ObjectId
): Promise<HoldingsLoadResult> {
  const snapshot = await PortfolioSnapshot.findOne({ userId }).sort({
    updatedAt: -1,
  });

  const snapRows = (snapshot?.holdings as NormalizedHolding[] | undefined)?.filter(
    (h) => h && typeof h.symbol === "string"
  );

  if (snapRows && snapRows.length > 0) {
    return {
      holdings: snapRows,
      dataSource: "screenshot",
      failures: [],
      parseNotes: undefined,
    };
  }

  const connections = await BrokerConnection.find({ userId });
  const allHoldings: NormalizedHolding[] = [];
  const failures: string[] = [];

  for (const conn of connections) {
    try {
      if (conn.broker === "zerodha" && conn.accessToken) {
        const rows = await normalizeZerodhaHoldings(conn.accessToken);
        allHoldings.push(...rows);
      } else if (conn.broker === "upstox" && conn.accessToken) {
        failures.push("upstox");
      }
    } catch (e) {
      console.error(`[loadUserHoldings] ${conn.broker} failed`, e);
      failures.push(conn.broker);
    }
  }

  return {
    holdings: allHoldings,
    dataSource: allHoldings.length > 0 ? "broker" : "none",
    failures,
  };
}
