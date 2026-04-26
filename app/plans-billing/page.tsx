import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import {
  getCreditPacks,
  getPackPromoLabel,
  getProSaleDisplay,
  getStarterSaleDisplay,
  CREDIT_COST_CHAT,
  CREDIT_COST_VISION_PER_IMAGE,
  CREDIT_COST_PORTFOLIO_AI,
  type SaleDisplay,
} from "@/constants/credits";

export const metadata: Metadata = {
  title: "Plans & billing | MagicStocks.ai",
  description:
    "Pay only for what you use. Buy MagicStocks.ai credits with no subscriptions or expiry. AI for information and education — not investment advice.",
};

type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
  kind?: "free" | "paid" | "enterprise";
  sale?: SaleDisplay;
  promoLabel?: string;
};

function buildPlans(): Plan[] {
  const packs = getCreditPacks();
  const promo = getPackPromoLabel();
  const stSale = getStarterSaleDisplay();
  const prSale = getProSaleDisplay();
  const c = {
    chat: CREDIT_COST_CHAT,
    v: CREDIT_COST_VISION_PER_IMAGE,
    p: CREDIT_COST_PORTFOLIO_AI,
  };
  return [
    {
      name: "Free",
      price: "₹0",
      description: "Try MagicStocks at no cost.",
      features: [
        "2 starter credits",
        `Chat: ${c.chat} credit per completed reply`,
        `Screenshot import: ${c.v} credit per image`,
        `Portfolio AI analysis: ${c.p} credits per run`,
        "Viewing your portfolio table (no AI) is free",
      ],
      cta: "Get started",
      href: "/",
      kind: "free",
    },
    {
      name: "Starter",
      price: `₹${packs.starter.rupees}`,
      description: "Casual research & learning.",
      features: [
        `${packs.starter.credits} credits`,
        "No expiry",
        `Chat: ${c.chat} credit per completed reply`,
        `Screenshot import: ${c.v} credit per image`,
        `Portfolio AI analysis: ${c.p} credits per run`,
      ],
      cta: "Buy credits",
      href: "/manage-credits",
      kind: "paid",
      sale: stSale,
      promoLabel: promo,
    },
    {
      name: "Pro",
      price: `₹${packs.pro.rupees}`,
      description: "For regular learners — best value.",
      features: [
        `${packs.pro.credits} credits`,
        "No expiry",
        `Chat: ${c.chat} credit per completed reply`,
        `Screenshot import: ${c.v} credit per image`,
        `Portfolio AI analysis: ${c.p} credits per run`,
        "Priority email support",
      ],
      cta: "Buy credits",
      href: "/manage-credits",
      highlight: true,
      kind: "paid",
      sale: prSale,
      promoLabel: promo,
    },
    {
      name: "Enterprise",
      price: "Talk to us",
      description: "Custom volume for teams & partners.",
      features: ["Custom credit volume", "Invoiced billing", "Tailored onboarding"],
      cta: "Contact us",
      href: "mailto:support@magicstocks.ai",
      kind: "enterprise",
    },
  ];
}

export default function PlansPage() {
  const PLANS = buildPlans();
  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 hero-spotlight" />

      <section className="container mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <Badge
            variant="secondary"
            className="border-primary/20 bg-primary/10 text-primary"
          >
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            Simple, lifetime credits
          </Badge>
          <p className="mt-3 text-sm font-medium text-primary">
            {getPackPromoLabel()}: special pricing on Starter &amp; Pro — limited time.
          </p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Pay <span className="text-brand-gradient">only</span> for what you use
          </h1>
          <p className="mt-4 text-muted-foreground">
            No subscriptions, no auto-renewals, no expiry. Top up credits
            whenever you need them.{" "}
            <span className="font-medium text-foreground">
              Credits cover chat replies, screenshot import, and portfolio AI —
              see each plan for the exact weights.
            </span>
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.highlight
                  ? "border-primary/40 shadow-lg shadow-primary/10"
                  : ""
              }`}
            >
              {plan.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gradient text-primary-foreground border-0 shadow-md">
                  Most popular
                </Badge>
              )}
              <CardHeader className="space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  {plan.sale?.listInr != null &&
                    plan.sale.savingsInr != null &&
                    plan.promoLabel && (
                      <Badge
                        variant="secondary"
                        className="shrink-0 border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100"
                      >
                        {plan.promoLabel}
                      </Badge>
                    )}
                </div>
                {plan.kind === "enterprise" || plan.kind === "free" ? (
                  <div className="font-display text-4xl font-semibold tabular-nums">
                    {plan.price}
                  </div>
                ) : plan.sale?.listInr != null &&
                  plan.sale.savingsInr != null &&
                  plan.sale.percentOff != null ? (
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                      <span className="text-xl text-muted-foreground line-through tabular-nums">
                        ₹{plan.sale.listInr}
                      </span>
                      <span className="font-display text-4xl font-semibold tabular-nums text-foreground">
                        ₹{plan.sale.saleInr}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-primary mt-1">
                      You save ₹{plan.sale.savingsInr} ({plan.sale.percentOff}%
                      off)
                    </p>
                  </div>
                ) : (
                  <div className="font-display text-4xl font-semibold tabular-nums">
                    {plan.price}
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="grid gap-3 flex-1">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="h-5 w-5 rounded-full bg-primary/10 grid place-items-center shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  size="lg"
                  asChild
                  className={`w-full ${
                    plan.highlight ? "bg-brand-gradient hover:opacity-90" : ""
                  }`}
                  variant={
                    plan.name === "Enterprise" || plan.name === "Free"
                      ? "outline"
                      : "default"
                  }
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-10 max-w-2xl mx-auto">
          MagicStocks.ai provides information and education only. We are not
          SEBI-registered as an investment adviser or research analyst. Nothing
          here is investment advice.
        </p>
      </section>
    </main>
  );
}
