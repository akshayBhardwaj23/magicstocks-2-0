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
import { BookOpen, Compass, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | MagicStocks.ai",
  description:
    "MagicStocks.ai is an AI-powered information and education tool for Indian markets. We are not a SEBI-registered investment adviser or research analyst.",
};

export default function AboutPage() {
  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 hero-spotlight" />
      <section className="container mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <Badge
            variant="secondary"
            className="border-primary/20 bg-primary/10 text-primary"
          >
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            About MagicStocks
          </Badge>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Markets, made <span className="text-brand-gradient">explorable</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            We help curious investors learn how Indian markets work — using AI
            to surface public data, news context, and clear explanations.
            Information and education only; not personalized investment advice.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card interactive className="surface-soft">
            <CardHeader>
              <div className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base mt-2">Learn faster</CardTitle>
              <CardDescription>
                Plain-language explainers on companies, sectors, and concepts.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card interactive className="surface-soft">
            <CardHeader>
              <div className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center">
                <Compass className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base mt-2">Research, your way</CardTitle>
              <CardDescription>
                Public data, news context, and follow-up Q&A in one place.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card interactive className="surface-soft">
            <CardHeader>
              <div className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base mt-2">No tips, no calls</CardTitle>
              <CardDescription>
                We don’t recommend trades. For decisions, talk to a registered
                adviser.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="mt-10">
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none p-6 sm:p-8">
            <h2 className="font-display">Our approach</h2>
            <p>
              MagicStocks.ai is an information and learning product. We combine
              AI assistance with public market data to help you study companies,
              indices, themes, and your own portfolio context — in your own
              words.
            </p>
            <p>
              We are <strong>not</strong> a SEBI-registered investment adviser
              or research analyst. Nothing on this site is investment advice or
              a recommendation to buy, sell, or hold any security. For
              decisions involving your money, please consult a SEBI-registered
              investment adviser or other qualified professional.
            </p>
            <h2 className="font-display">What you can do here</h2>
            <ul>
              <li>Ask questions about companies, sectors, indices, and concepts.</li>
              <li>
                Upload portfolio screenshots to get an organized educational
                view of your holdings.
              </li>
              <li>
                Read AI-generated summaries that highlight context — never
                trade instructions.
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-10">
          <Button asChild className="bg-brand-gradient hover:opacity-90">
            <Link href="/contact-us">Get in touch</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
