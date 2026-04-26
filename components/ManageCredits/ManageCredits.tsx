import { getMessagesCount } from "@/lib/userData";
import React from "react";
import Plans from "../Plans/Plans";
import { Sparkles, Coins } from "lucide-react";
import { Badge } from "../ui/badge";

const ManageCredits = async ({
  email,
}: {
  email: string | undefined | null;
}) => {
  const count = await getMessagesCount(email);

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 hero-spotlight" />

      <div className="container mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="text-center max-w-2xl mx-auto">
          <Badge
            variant="secondary"
            className="border-primary/20 bg-primary/10 text-primary"
          >
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            Credits
          </Badge>
          <h1 className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Manage your credits
          </h1>
          <p className="mt-3 text-muted-foreground">
            Top up credits to keep exploring. No subscriptions, no expiry —{" "}
            <span className="font-medium text-foreground">
              1 credit = 1 AI message.
            </span>
          </p>
        </div>

        <div className="mt-8 mx-auto max-w-md">
          <div className="flex items-center gap-4 rounded-2xl border bg-brand-gradient text-primary-foreground px-5 py-4 shadow-md">
            <div className="h-10 w-10 rounded-full bg-white/20 grid place-items-center">
              <Coins className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm/none opacity-90">Available credits</div>
              <div className="font-display text-3xl font-semibold tabular-nums">
                {count}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Plans />
        </div>

        <p className="text-xs text-muted-foreground text-center mt-10 max-w-2xl mx-auto">
          MagicStocks.ai provides information and education only. Nothing here
          is investment advice.
        </p>
      </div>
    </main>
  );
};

export default ManageCredits;
