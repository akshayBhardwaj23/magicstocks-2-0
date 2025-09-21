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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
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
                <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="flex items-center gap-2 px-4 flex-1">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Link href="/" className="flex items-center gap-2">
                      <Image
                        alt="Magic Stocks AI"
                        width={200}
                        height={20}
                        src={logo}
                        className="h-8 w-auto"
                      />
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 px-4">
                    <ThemeToggle />
                  </div>
                </header>
                <main className="flex-1">{children}</main>
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
