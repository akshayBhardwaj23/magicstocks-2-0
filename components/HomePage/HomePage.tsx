"use client";
import React, { useEffect, useRef, useState } from "react";

import { KeyboardEvent } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { useChat } from "ai/react";

import { ImSpinner } from "react-icons/im";
import MemoizedMessage from "../MemoizedMessage/MemoizedMessage";
import ChatForm from "../ChatForm/ChatForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import SuggestedText from "../SuggestedText/SuggestedText";
import {
  ArrowRight,
  BookOpen,
  Layers,
  LineChart,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const HomePage = () => {
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error,
    reload,
  } = useChat({
    onError: (error) => {
      if (error.message.includes("Credits expired"))
        toast({
          variant: "destructive",
          title: "Uh oh! No credits left.",
          description:
            "Please purchase more credits to continue using MagicStocks.ai.",
          action: (
            <ToastAction altText="Buy credits">
              <Link href="/manage-credits">Buy credits</Link>
            </ToastAction>
          ),
        });
    },
  });

  const [firstMessage, wasFirstMessage] = useState<boolean>(true);
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    scrollToBottom();
    if (messages.length > 0) wasFirstMessage(false);
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleKeyPress = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (!session?.user) {
        redirect("/api/auth/signin");
      }
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestedText = (val: string) => {
    setInput(val);
  };

  const showHero = messages.length === 0;

  const ChatBody = (
    <div className="flex flex-col gap-4 p-4 max-w-4xl mx-auto md:p-6 md:gap-6">
      {showHero && <Hero session={session} />}
      {messages.map((message) => (
        <MemoizedMessage key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );

  const LoadingState = isLoading && (
    <div className="flex justify-center p-4">
      <div className="flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur">
        <ImSpinner className="animate-spin h-4 w-4 text-primary" />
        <span>Thinking…</span>
      </div>
    </div>
  );

  const ErrorBlock = error && (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
        <div className="text-destructive font-medium mb-2">
          An error occurred
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          {error.message.includes("Credits expired")
            ? "You have run out of credits. Please purchase more to continue."
            : "Something went wrong. Please try again."}
        </div>
        <div className="flex gap-2">
          {error.message.includes("Credits expired") && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/manage-credits">Buy credits</Link>
            </Button>
          )}
          <Button type="button" size="sm" onClick={() => reload()}>
            Retry
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col h-full">
      {/* Mobile layout */}
      <div className="md:hidden flex flex-col h-full">
        <ScrollArea ref={scrollAreaRef} className="flex-1 pb-32">
          {ChatBody}
          {LoadingState}
          {ErrorBlock}
        </ScrollArea>

        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-t">
          {firstMessage && (
            <div className="border-b">
              <SuggestedText handleSuggestedText={handleSuggestedText} />
            </div>
          )}
          <ChatForm
            handleSubmit={handleSubmit}
            input={input}
            handleInputChange={handleInputChange}
            handleKeyPress={handleKeyPress}
            isLoading={isLoading}
            stop={stop}
          />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex flex-1 flex-col min-h-0">
        <ScrollArea
          ref={scrollAreaRef}
          className="flex-1 h-[calc(100vh-180px)]"
        >
          {ChatBody}
          {LoadingState}
          {ErrorBlock}
          {firstMessage && (
            <SuggestedText handleSuggestedText={handleSuggestedText} />
          )}
        </ScrollArea>

        <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
          <ChatForm
            handleSubmit={handleSubmit}
            input={input}
            handleInputChange={handleInputChange}
            handleKeyPress={handleKeyPress}
            isLoading={isLoading}
            stop={stop}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

function Hero({ session }: { session: ReturnType<typeof useSession>["data"] }) {
  const features: { icon: typeof TrendingUp; title: string; body: string }[] = [
    {
      icon: TrendingUp,
      title: "Decode tickers",
      body: "Plain-English context on price action, indicators, and recent news for NSE & BSE names.",
    },
    {
      icon: Layers,
      title: "Sectors & themes",
      body: "Compare large caps, study sector themes, and learn how analysts read fundamentals.",
    },
    {
      icon: BookOpen,
      title: "Market literacy",
      body: "Concepts like P/E, ROCE, beta, and CAGR explained as you ask—no jargon walls.",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="absolute inset-0 hero-spotlight pointer-events-none" />

      <div className="relative px-6 py-10 md:px-10 md:py-14">
        <Badge
          variant="secondary"
          className="border-primary/20 bg-primary/10 text-primary"
        >
          <Sparkles className="mr-1 h-3.5 w-3.5" />
          Information & education first
        </Badge>

        <h1 className="mt-4 max-w-3xl font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight">
          Understand{" "}
          <span className="text-brand-gradient">Indian markets</span> with an AI
          that explains, not prescribes.
        </h1>

        <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground">
          {session?.user
            ? `Welcome back, ${session.user.name?.split(" ")[0] ?? "investor"} — ask about a stock, a sector, or a concept. Answers stay educational.`
            : "Ask about a stock, a sector, or a market concept. Answers stay educational—never buy/sell calls."}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-brand-gradient hover:opacity-90 transition shadow-md text-base"
          >
            <Link href="/portfolio" className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Open portfolio (education)
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-base"
          >
            <Link href="/help-faq">How it works</Link>
          </Button>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Not a SEBI-registered investment adviser. Consult a professional for
          personalized advice.
        </div>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-px bg-border/60 border-t">
        {features.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="bg-card p-5 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="font-medium">{title}</div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
