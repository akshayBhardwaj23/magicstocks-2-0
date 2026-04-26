"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import { updateMessageCount } from "@/lib/userData";
import { Badge } from "../ui/badge";

type Plan = {
  id: "Starter" | "Pro" | "Enterprise";
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  contact?: boolean;
};

type PackConfig = {
  packs: {
    starter: { rupees: number; credits: number };
    pro: { rupees: number; credits: number };
  };
  costs: {
    chat: number;
    visionPerImage: number;
    portfolioAi: number;
  };
};

function buildPlans(cfg: PackConfig | null): Plan[] {
  const s = cfg?.packs.starter ?? { rupees: 99, credits: 20 };
  const p = cfg?.packs.pro ?? { rupees: 799, credits: 300 };
  const c = cfg?.costs ?? {
    chat: 1,
    visionPerImage: 1,
    portfolioAi: 2,
  };
  return [
    {
      id: "Starter",
      name: "Starter",
      price: `₹${s.rupees}`,
      description: "For occasional research and learning.",
      features: [
        `${s.credits} credits`,
        "No expiry",
        `Chat: ${c.chat} credit per completed reply`,
        `Portfolio screenshot import: ${c.visionPerImage} credit per image`,
        `Portfolio AI analysis: ${c.portfolioAi} credits per run`,
      ],
      cta: "Buy credits",
    },
    {
      id: "Pro",
      name: "Pro",
      price: `₹${p.rupees}`,
      description: "For regular learners — best value.",
      features: [
        `${p.credits} credits`,
        "No expiry",
        `Chat: ${c.chat} credit per completed reply`,
        `Portfolio screenshot import: ${c.visionPerImage} credit per image`,
        `Portfolio AI analysis: ${c.portfolioAi} credits per run`,
        "Priority email support",
      ],
      cta: "Buy credits",
      highlight: true,
    },
    {
      id: "Enterprise",
      name: "Enterprise",
      price: "Talk to us",
      description: "Custom packs for teams and partners.",
      features: [
        "Custom credit volume",
        "Invoiced billing",
        "Tailored onboarding",
      ],
      cta: "Contact us",
      contact: true,
    },
  ];
}

const Plans = () => {
  const { data: session } = useSession();
  const [cfg, setCfg] = useState<PackConfig | null>(null);

  useEffect(() => {
    fetch("/api/credits/config")
      .then((r) => r.json())
      .then((d) => {
        if (d?.packs && d?.costs) setCfg(d);
      })
      .catch(() => {});
  }, []);

  const PLANS = useMemo(() => buildPlans(cfg), [cfg]);

  const handleCredits = async (planType: string) => {
    try {
      const res = await axios.post("/api/order", {
        email: session?.user?.email,
        planType,
      });

      if (res.status === 200) {
        const { order, createdOrderId } = await res.data;
        if (order?.id) {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "MagicStocks.ai",
            description: "MagicStocks.ai Credits",
            order_id: order.id,
            handler: async function (response: any) {
              const data = {
                orderCreationId: order.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: createdOrderId,
                razorpaySignature: response.razorpay_signature,
              };

              const result = await fetch("/api/verify", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
              });
              const res = await result.json();
              if (res.isOk) {
                alert("payment succeed");
                await updateMessageCount(session?.user?.email, planType);
              } else {
                alert(res.message);
              }
            },
            prefill: {
              name: session?.user?.name,
              email: session?.user?.email,
            },
            theme: {
              color: "#10b981",
            },
          };
          const paymentObject = new (window as any).Razorpay(options);
          paymentObject.on("payment.failed", function (response: any) {
            alert(response.error.description);
          });
          paymentObject.open();
        }
      } else {
        console.log("Unexpected status:", res.status, res.data.message);
      }
    } catch (error: any) {
      if (error.response) {
        console.log("Error response:", error.response.data.message);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Request error:", error.message);
      }
    }
  };

  return (
    <>
      {PLANS.map((plan) => (
        <Card
          key={plan.id}
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
          <CardHeader>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <div className="font-display text-4xl font-semibold tabular-nums">
              {plan.price}
            </div>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
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
            {plan.contact ? (
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                asChild
              >
                <Link href="mailto:support@magicstocks.ai">{plan.cta}</Link>
              </Button>
            ) : (
              <Button
                size="lg"
                className={`w-full ${
                  plan.highlight ? "bg-brand-gradient hover:opacity-90" : ""
                }`}
                onClick={() => handleCredits(plan.id)}
              >
                {plan.cta}
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default Plans;
