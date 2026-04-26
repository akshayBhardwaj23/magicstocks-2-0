"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageCircle,
  CreditCard,
  Shield,
  Bot,
  Users,
  Mail,
  FileText,
  Star,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const HelpPage = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "What is MagicStocks.ai and how does it work?",
      answer:
        "MagicStocks.ai is an information and education platform for Indian markets. AI helps you explore public data, company context, and market topics in plain language. It is not a SEBI-registered investment adviser or research analyst, and does not give buy / sell / hold calls. For investment decisions, please consult a registered professional.",
    },
    {
      question: "Does the AI predict stock prices or tell me what to buy?",
      answer:
        "No. We don’t position the product as a tip or prediction service. Outputs are for learning and research support. Markets are uncertain; any numbers or scenarios are illustrative unless clearly sourced.",
    },
    {
      question: "How do I get started?",
      answer:
        "Sign up, top up some credits, and start asking questions about companies, sectors, or how markets work. To explore your own portfolio, upload one or more screenshots of your holdings — AI will read them into a single educational view.",
    },
    {
      question: "What are credits and how do they work?",
      answer:
        "Credits are used for AI interactions. Each question or analysis request consumes one credit. You can purchase credit packs from the billing page. Credits don’t expire automatically.",
    },
    {
      question: "Can I connect my Zerodha or Upstox account?",
      answer:
        "In-app broker linking is paused for now. Instead, you can upload screenshots from your broker app or statement and we’ll extract holdings into a structured, educational view.",
    },
    {
      question: "Is my data secure?",
      answer:
        "We use HTTPS throughout, store only what we need, and never sell your data. Uploaded screenshots are processed to extract holdings and stored against your account so you can refresh your view; you can delete them anytime from the portfolio page.",
    },
    {
      question: "What can I explore with the AI?",
      answer:
        "Ask for educational explanations: how indicators are read, what recent news and filings discuss, sector themes, and risk concepts. For portfolio-linked views, we show data and learning notes — not recommendations to buy, sell, or rebalance.",
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        "Manage credits and payments from the Account → Billing area. You can pause or cancel anytime; remaining credits stay in your account.",
    },
    {
      question: "Can I use MagicStocks.ai on mobile devices?",
      answer:
        "Yes — the platform is fully responsive across mobile, tablet, and desktop.",
    },
  ];

  const quickLinks = [
    {
      title: "Getting started",
      description: "Set up your account and your first prompt",
      icon: Star,
    },
    {
      title: "Account & billing",
      description: "Credits, plans, and invoices",
      icon: CreditCard,
    },
    {
      title: "Portfolio uploads",
      description: "Use screenshots, not broker linking",
      icon: Shield,
    },
    {
      title: "AI & education",
      description: "What the AI is — and isn't — for",
      icon: Bot,
    },
  ];

  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 hero-spotlight" />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto">
          <Badge
            variant="secondary"
            className="border-primary/20 bg-primary/10 text-primary"
          >
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            Help & FAQ
          </Badge>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight flex items-center justify-center gap-3">
            <HelpCircle className="h-9 w-9 text-primary" />
            How can we help?
          </h1>
          <p className="mt-4 text-muted-foreground">
            Common questions about MagicStocks.ai — what it is, how to use it,
            and how we think about education vs. investment advice.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Card key={link.title} interactive className="surface-soft">
              <CardHeader className="text-center">
                <link.icon className="h-7 w-7 mx-auto text-primary" />
                <CardTitle className="text-base mt-2">{link.title}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-center">
            Frequently asked questions
          </h2>
          <div className="mt-6 space-y-3 max-w-3xl mx-auto">
            {faqData.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left"
                >
                  <CardHeader className="flex-row items-center justify-between space-y-0 hover:bg-muted/50 transition-colors">
                    <CardTitle className="text-base pr-8">
                      {faq.question}
                    </CardTitle>
                    {openFAQ === index ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </CardHeader>
                </button>
                {openFAQ === index && (
                  <CardContent className="pt-0">
                    <Separator className="mb-4" />
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {faq.answer}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        <Card className="mt-12 surface-soft">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Still need help?
            </CardTitle>
            <CardDescription>
              Drop us a line — we usually respond within a couple of business
              days.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-brand-gradient hover:opacity-90">
              <Link href="mailto:support@magicstocks.ai" className="gap-2">
                <Mail className="h-4 w-4" />
                support@magicstocks.ai
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact-us">Contact page</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about-us"
                    className="text-primary hover:underline"
                  >
                    About MagicStocks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-conditions"
                    className="text-primary hover:underline"
                  >
                    Terms & conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-primary hover:underline"
                  >
                    Privacy policy
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-primary" />
                Stay in the loop
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We share product updates from time to time. To request a feature
                or share feedback, just email us at{" "}
                <a
                  className="text-primary hover:underline"
                  href="mailto:support@magicstocks.ai"
                >
                  support@magicstocks.ai
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 p-6 surface-soft rounded-2xl">
          <p className="text-xs text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <strong className="text-foreground">Disclaimer.</strong> MagicStocks.ai
            provides information and education only. We are not SEBI-registered
            as an investment adviser or research analyst. Nothing here is
            investment, legal, or tax advice. Consult a SEBI-registered
            investment adviser or other qualified professional before
            transacting. Past performance does not guarantee future results.
            Investments are subject to market risks.
          </p>
        </div>
      </div>
    </main>
  );
};

export default HelpPage;
