import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import { Compass, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — page not found | MagicStocks.ai",
  description:
    "We couldn’t find that page. Head back home or try the AI chat to keep exploring.",
};

export default function NotFoundPage() {
  return (
    <main className="relative min-h-[80vh] grid place-items-center px-4">
      <div className="pointer-events-none absolute inset-0 -z-10 hero-spotlight" />

      <div className="text-center max-w-lg">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-brand-gradient grid place-items-center shadow-md">
          <Compass className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="mt-6 font-display text-7xl sm:text-8xl font-semibold tracking-tight text-brand-gradient">
          404
        </h1>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
          Page not found
        </h2>
        <p className="mt-3 text-muted-foreground">
          The page you’re looking for has moved or never existed. Let’s get you
          back to something useful.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-brand-gradient hover:opacity-90">
            <Link href="/" className="gap-2">
              <Home className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/help-faq">Browse help & FAQ</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
