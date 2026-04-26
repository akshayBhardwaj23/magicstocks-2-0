"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, X } from "lucide-react";
import { getMessagesCount } from "@/lib/userData";
import { Button } from "@/components/ui/button";

const DEFAULT_THRESHOLD = 3;

function getThreshold(): number {
  if (typeof window === "undefined") return DEFAULT_THRESHOLD;
  const raw = process.env.NEXT_PUBLIC_LOW_CREDIT_WARNING_THRESHOLD;
  if (!raw) return DEFAULT_THRESHOLD;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_THRESHOLD;
}

/**
 * Sticky warning when balance is above 0 but at or below the threshold.
 * Dismissal is session-only (reappears on next navigation if still low).
 */
export function LowCreditsBanner() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [balance, setBalance] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const refresh = useCallback(async () => {
    if (status !== "authenticated" || !session?.user?.email) {
      setBalance(null);
      return;
    }
    try {
      const c = await getMessagesCount(session.user.email);
      setBalance(typeof c === "number" ? c : null);
    } catch {
      setBalance(null);
    }
  }, [session?.user?.email, status]);

  useEffect(() => {
    setDismissed(false);
  }, [pathname]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (status !== "authenticated" || balance === null) return null;
  if (dismissed) return null;
  if (balance <= 0) return null;

  const threshold = getThreshold();
  if (balance > threshold) return null;

  return (
    <div
      className="border-b border-amber-300/80 bg-amber-50 text-amber-950 dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-100"
      role="status"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 pr-2 text-sm">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="min-w-0 leading-snug">
            <span className="font-medium">Credits are running low.</span> You
            have{" "}
            <span className="font-semibold tabular-nums">
              {balance} credit{balance === 1 ? "" : "s"}
            </span>{" "}
            left. Refill to keep using chat, screenshot import, and portfolio
            analysis without interruption.{" "}
            <Link
              href="/manage-credits"
              className="font-medium text-amber-900 underline underline-offset-2 hover:text-amber-800 dark:text-amber-200 dark:hover:text-amber-50"
            >
              Add credits
            </Link>{" "}
            or see{" "}
            <Link
              href="/plans-billing"
              className="font-medium text-amber-900 underline underline-offset-2 hover:text-amber-800 dark:text-amber-200 dark:hover:text-amber-50"
            >
              plans
            </Link>
            .
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-amber-900/70 hover:bg-amber-200/50 hover:text-amber-900 dark:text-amber-200/80 dark:hover:bg-amber-900/30"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
