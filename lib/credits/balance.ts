import type { Types } from "mongoose";
import User from "@/models/User";

type Id = Types.ObjectId | string;

/**
 * Read-only: enough credits to afford `cost`?
 */
export async function hasMinimumCredits(
  userId: Id,
  cost: number
): Promise<{ ok: true; balance: number } | { ok: false; balance: number }> {
  const u = await User.findById(userId).select({ current_messages: 1 });
  const balance = u?.current_messages ?? 0;
  if (cost <= 0) return { ok: true, balance };
  if (balance >= cost) return { ok: true, balance };
  return { ok: false, balance };
}

/**
 * Atomic decrement when balance >= cost. Returns new balance, or failed with current.
 */
export async function tryConsumeCredits(
  userId: Id,
  cost: number
): Promise<
  { ok: true; remaining: number } | { ok: false; remaining: number }
> {
  if (cost <= 0) {
    const u = await User.findById(userId).select({ current_messages: 1 });
    return { ok: true, remaining: u?.current_messages ?? 0 };
  }
  const user = await User.findOneAndUpdate(
    { _id: userId, current_messages: { $gte: cost } },
    { $inc: { current_messages: -cost } },
    { new: true }
  ).select({ current_messages: 1 });
  if (!user) {
    const u = await User.findById(userId).select({ current_messages: 1 });
    return { ok: false, remaining: u?.current_messages ?? 0 };
  }
  return { ok: true, remaining: user.current_messages };
}

/** Best-effort refund (e.g. DB failed after credit charge). */
export async function refundCredits(userId: Id, amount: number): Promise<void> {
  if (amount <= 0) return;
  try {
    await User.findByIdAndUpdate(userId, { $inc: { current_messages: amount } });
  } catch (e) {
    console.error("[credits refundCredits]", e);
  }
}
