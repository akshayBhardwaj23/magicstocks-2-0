"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Phone,
  Mail,
  FileText,
  Star,
} from "lucide-react";

const HelpPage = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "What is MagicStocks.ai and how does it work?",
      answer:
        "MagicStocks.ai is an information and education platform for Indian markets. It uses AI to help you explore public data, company context, and market topics in plain language. It does not provide SEBI-regulated investment advice, research reports, or personalized buy/sell recommendations. For investment decisions, speak to a SEBI-registered investment adviser or other qualified professional.",
    },
    {
      question: "Does the AI predict stock prices or tell me what to buy?",
      answer:
        "No. We do not position the product as a prediction or tip service. Outputs are for learning and research support. Markets are uncertain; any numbers or scenarios are illustrative unless clearly sourced. Always do your own diligence and use licensed professionals when you need advice.",
    },
    {
      question: "How do I get started with MagicStocks.ai?",
      answer:
        "Sign up for an account, purchase credits, and start with questions about companies, sectors, or how markets work. Optional in-app broker account linking is temporarily unavailable; the portfolio area will support other ways to add context when we ship them—not a substitute for professional advice.",
    },
    {
      question: "What are credits and how do they work?",
      answer:
        "Credits are used for AI interactions on our platform. Each question or analysis request consumes one credit. You can purchase credit packs through our billing system. Credits never expire and can be used anytime.",
    },
    {
      question: "Can I connect my existing broker account?",
      answer:
        "Not in the app right now—broker account linking (e.g. via supported Indian brokers) is temporarily turned off. When it returns, it would let you view your holdings for educational context only, not personalized investment advice. We will describe security and data handling in product updates at that time.",
    },
    {
      question: "Is my data secure?",
      answer:
        "We use strong encryption in transit and protect account data. If broker linking is offered again in the future, credentials or tokens would be stored securely and not sold to third parties. We work to follow applicable data protection requirements.",
    },
    {
      question: "What can I explore with the AI?",
      answer:
        "You can ask for educational explanations: how indicators are read, what recent news and filings discuss, sector themes, and high-level risk ideas people study in textbooks—not trade instructions. For portfolio-linked views, we show data and learning-oriented notes, not recommendations to buy, sell, or rebalance.",
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        "You can manage your subscription and credits through your account dashboard. Go to 'Manage Credits' or 'Billing History' to view your current plan and make changes. You can pause or cancel anytime without losing your remaining credits.",
    },
    {
      question: "Do you offer customer support?",
      answer:
        "Yes! We provide customer support through email and our help center. For urgent matters, you can reach us through our contact page. We typically respond within 24 hours during business days.",
    },
    {
      question: "Can I use MagicStocks.ai on mobile devices?",
      answer:
        "Yes! Our platform is fully responsive and works on mobile, tablets, and desktops. You can use AI chat and portfolio areas from any device. Optional broker linking is currently unavailable; features may change as we release updates.",
    },
  ];

  const quickLinks = [
    {
      title: "Getting Started",
      description: "Learn how to set up your account",
      icon: Star,
      href: "#getting-started",
    },
    {
      title: "Account & Billing",
      description: "Manage your credits and subscription",
      icon: CreditCard,
      href: "#billing",
    },
    {
      title: "Portfolio",
      description: "Broker linking paused; more options coming",
      icon: Shield,
      href: "#brokers",
    },
    {
      title: "AI & education",
      description: "How we use AI (non-advisory)",
      icon: Bot,
      href: "#ai-analysis",
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "support@magicstocks.ai",
      action: "Send Email",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Available 9 AM - 6 PM IST",
      action: "Start Chat",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+91-XXX-XXX-XXXX",
      action: "Call Now",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <HelpCircle className="h-10 w-10 text-primary" />
          Help & FAQ
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Find answers to common questions about MagicStocks.ai, get support,
          and learn how to make the most of our AI-powered stock analysis
          platform.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {quickLinks.map((link, index) => (
          <Card
            key={index}
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardHeader className="text-center">
              <link.icon className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">{link.title}</CardTitle>
              <CardDescription>{link.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <Card key={index} className="border">
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg pr-8">{faq.question}</CardTitle>
                  {openFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              {openFAQ === index && (
                <CardContent className="pt-0">
                  <Separator className="mb-4" />
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Still Need Help?
          </CardTitle>
          <CardDescription className="text-lg">
            Our support team is here to help you succeed with MagicStocks.ai
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <method.icon className="h-8 w-8 mx-auto text-primary mb-3" />
                <h3 className="font-semibold mb-2">{method.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {method.description}
                </p>
                <Button variant="outline" size="sm">
                  {method.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                •{" "}
                <a href="#" className="text-primary hover:underline">
                  API Documentation
                </a>
              </li>
              <li>
                •{" "}
                <a href="#" className="text-primary hover:underline">
                  Integration Guide
                </a>
              </li>
              <li>
                •{" "}
                <a href="#" className="text-primary hover:underline">
                  Best Practices
                </a>
              </li>
              <li>
                •{" "}
                <a href="#" className="text-primary hover:underline">
                  Security Guidelines
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                •{" "}
                <a href="#" className="text-primary hover:underline">
                  User Forum
                </a>
              </li>
              <li>
                •{" "}
                <a href="#" className="text-primary hover:underline">
                  Feature Requests
                </a>
              </li>
              <li>
                •{" "}
                <a href="#" className="text-primary hover:underline">
                  Success Stories
                </a>
              </li>
              <li>
                •{" "}
                <a href="#" className="text-primary hover:underline">
                  Beta Testing
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Footer Note */}
      <div className="text-center mt-12 p-6 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Disclaimer:</strong> MagicStocks.ai provides information and
          education only. We are not SEBI-registered as an investment adviser or
          research analyst. Nothing here is investment, legal, or tax advice.
          Consult a SEBI-registered investment adviser or other qualified
          professional before transacting. Past performance does not guarantee
          future results. Investments are subject to market risks.
        </p>
      </div>
    </div>
  );
};

export default HelpPage;
