"use client";

import { Metadata } from "next";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  MessageCircle, 
  CreditCard, 
  Shield, 
  TrendingUp,
  Bot,
  Users,
  Phone,
  Mail,
  FileText,
  Star
} from "lucide-react";

const HelpPage = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "What is MagicStocks.ai and how does it work?",
      answer: "MagicStocks.ai is an AI-powered stock analysis platform that uses advanced machine learning algorithms to provide real-time stock analysis, market predictions, and investment insights. Our AI analyzes market data, company fundamentals, and market sentiment to help you make informed investment decisions."
    },
    {
      question: "How accurate are the AI predictions?",
      answer: "While our AI provides sophisticated analysis based on historical data and market patterns, it's important to remember that all investments carry risk. Our AI is designed to assist with research and analysis, but we recommend consulting with financial advisors and conducting your own research before making investment decisions. Past performance does not guarantee future results."
    },
    {
      question: "How do I get started with MagicStocks.ai?",
      answer: "Getting started is easy! Simply sign up for an account, purchase credits, and start asking questions about stocks, market analysis, or investment strategies. You can also connect your broker account (Zerodha or Upstox) for personalized portfolio analysis."
    },
    {
      question: "What are credits and how do they work?",
      answer: "Credits are used for AI interactions on our platform. Each question or analysis request consumes one credit. You can purchase credit packs through our billing system. Credits never expire and can be used anytime."
    },
    {
      question: "Can I connect my existing broker account?",
      answer: "Yes! We support integration with Zerodha and Upstox. Once connected, you can get personalized portfolio analysis, track your holdings, and receive AI-powered insights about your investments. All connections are secure and encrypted."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-level encryption to protect your data. Your broker credentials are securely stored and never shared with third parties. We comply with all financial data protection regulations and maintain strict security protocols."
    },
    {
      question: "What types of analysis can I get?",
      answer: "You can get various types of analysis including: stock price predictions, technical analysis, fundamental analysis, market sentiment analysis, portfolio optimization suggestions, risk assessment, and sector analysis. Our AI can also answer specific questions about companies, industries, or market conditions."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can manage your subscription and credits through your account dashboard. Go to 'Manage Credits' or 'Billing History' to view your current plan and make changes. You can pause or cancel anytime without losing your remaining credits."
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes! We provide customer support through email and our help center. For urgent matters, you can reach us through our contact page. We typically respond within 24 hours during business days."
    },
    {
      question: "Can I use MagicStocks.ai on mobile devices?",
      answer: "Yes! Our platform is fully responsive and works seamlessly on mobile devices, tablets, and desktops. You can access all features including AI chat, portfolio analysis, and broker integration from any device."
    }
  ];

  const quickLinks = [
    { title: "Getting Started", description: "Learn how to set up your account", icon: Star, href: "#getting-started" },
    { title: "Account & Billing", description: "Manage your credits and subscription", icon: CreditCard, href: "#billing" },
    { title: "Broker Integration", description: "Connect Zerodha or Upstox", icon: Shield, href: "#brokers" },
    { title: "AI Analysis", description: "Understanding AI predictions", icon: Bot, href: "#ai-analysis" }
  ];

  const contactMethods = [
    { icon: Mail, title: "Email Support", description: "support@magicstocks.ai", action: "Send Email" },
    { icon: MessageCircle, title: "Live Chat", description: "Available 9 AM - 6 PM IST", action: "Start Chat" },
    { icon: Phone, title: "Phone Support", description: "+91-XXX-XXX-XXXX", action: "Call Now" }
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
          Find answers to common questions about MagicStocks.ai, get support, and learn how to make the most of our AI-powered stock analysis platform.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {quickLinks.map((link, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
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
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
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
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
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
              <div key={index} className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <method.icon className="h-8 w-8 mx-auto text-primary mb-3" />
                <h3 className="font-semibold mb-2">{method.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                <Button variant="outline" size="sm">{method.action}</Button>
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
              <li>• <a href="#" className="text-primary hover:underline">API Documentation</a></li>
              <li>• <a href="#" className="text-primary hover:underline">Integration Guide</a></li>
              <li>• <a href="#" className="text-primary hover:underline">Best Practices</a></li>
              <li>• <a href="#" className="text-primary hover:underline">Security Guidelines</a></li>
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
              <li>• <a href="#" className="text-primary hover:underline">User Forum</a></li>
              <li>• <a href="#" className="text-primary hover:underline">Feature Requests</a></li>
              <li>• <a href="#" className="text-primary hover:underline">Success Stories</a></li>
              <li>• <a href="#" className="text-primary hover:underline">Beta Testing</a></li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Footer Note */}
      <div className="text-center mt-12 p-6 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Disclaimer:</strong> MagicStocks.ai provides AI-powered analysis for informational purposes only. 
          This is not financial advice. Always consult with qualified financial advisors before making investment decisions. 
          Past performance does not guarantee future results. Investments are subject to market risks.
        </p>
      </div>
    </div>
  );
};

export default HelpPage;
