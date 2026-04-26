import "./globals.css";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

import { SessionProvider } from "next-auth/react";
import Script from "next/script";
import Image from "next/image";
import logo from "../public/logo.png";
import { GoogleAnalytics } from "@next/third-parties/google";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Badge } from "@/components/ui/badge";
import { LowCreditsBanner } from "@/components/LowCreditsBanner";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable}`}
    >
      <body className="font-sans antialiased">
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                  <div className="flex flex-1 items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Link
                      href="/"
                      className="flex items-center gap-2 transition-opacity hover:opacity-80"
                    >
                      <Image
                        alt="MagicStocks AI"
                        width={200}
                        height={20}
                        src={logo}
                        className="h-8 w-auto"
                        priority
                      />
                      <Badge
                        variant="secondary"
                        className="hidden sm:inline-flex border-primary/20 bg-primary/10 text-primary text-[10px] font-medium uppercase tracking-wide"
                      >
                        Education
                      </Badge>
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 px-4">
                    <ThemeToggle />
                  </div>
                </header>
                <LowCreditsBanner />
                <main className="flex-1">{children}</main>
                <SiteDisclaimerFooter />
              </SidebarInset>
            </SidebarProvider>
          </SessionProvider>
        </ThemeProvider>
        <Toaster />
      </body>
      <GoogleAnalytics gaId={`${process.env.GOOGLE_ANALYTICS_TAG}`} />
    </html>
  );
}

function SiteDisclaimerFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:py-6 text-xs text-muted-foreground flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="leading-relaxed">
          MagicStocks.ai provides information and education only. We are not a
          SEBI-registered investment adviser or research analyst. Consult a
          qualified professional before making investment decisions.
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link
            href="/privacy-policy"
            className="hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms-conditions"
            className="hover:text-foreground transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/contact-us"
            className="hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
