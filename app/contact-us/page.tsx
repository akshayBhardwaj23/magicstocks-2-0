import { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, MessageSquare, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | MagicStocks.ai",
  description:
    "Reach the MagicStocks.ai team for questions, feedback, or partnerships. Information and education only — not investment advice.",
};

export default function ContactPage() {
  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 hero-spotlight" />
      <section className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <Badge
            variant="secondary"
            className="border-primary/20 bg-primary/10 text-primary"
          >
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            We&apos;d love to hear from you
          </Badge>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Get in <span className="text-brand-gradient">touch</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Questions, feedback, or partnership ideas — drop us a line and
            we’ll get back within a couple of business days.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card interactive className="surface-soft">
            <CardHeader>
              <div className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base mt-2">Email us</CardTitle>
              <CardDescription>
                We read every message. Best for support and product feedback.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="bg-brand-gradient hover:opacity-90 w-full"
              >
                <Link href="mailto:support@magicstocks.ai">
                  support@magicstocks.ai
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card interactive className="surface-soft">
            <CardHeader>
              <div className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base mt-2">Operational address</CardTitle>
              <CardDescription>
                #1448, TDI City, Sector 110, 140307 — Mohali, Punjab, India
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <Link href="/help-faq">Browse Help & FAQ</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <div className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">A quick reminder</CardTitle>
              <CardDescription>
                We can’t make personalised buy / sell / hold calls. For
                investment decisions, please speak with a SEBI-registered
                adviser.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </section>
    </main>
  );
}
