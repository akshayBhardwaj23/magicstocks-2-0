"use client";

import React, { KeyboardEvent, useEffect, useMemo, useRef } from "react";
import { useChat } from "ai/react";
import Link from "next/link";
import MemoizedMessage from "@/components/MemoizedMessage/MemoizedMessage";
import ChatForm from "@/components/ChatForm/ChatForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ImSpinner } from "react-icons/im";

const SUGGESTED_PROMPTS = [
  "Summarize my top holdings and concentration in simple terms.",
  "What does my current asset mix suggest about diversification (education only)?",
  "Explain my largest winner and loser based on this snapshot.",
  "What should I verify manually in this portfolio data before making decisions?",
];

type Props = {
  hasHoldings: boolean;
};

export default function PortfolioChatCard({ hasHoldings }: Props) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error,
  } = useChat({
    api: "/api/chat",
    body: { portfolioContext: true },
    onError: (err) => {
      const msg = String(err?.message || "");
      const noCredits =
        msg.includes("Insufficient credits") ||
        msg.includes("402") ||
        msg.includes("Credits expired");
      if (noCredits) {
        toast({
          variant: "destructive",
          title: "Not enough credits",
          description: (
            <span>
              Portfolio chat needs credits.{" "}
              <Link href="/manage-credits" className="font-medium underline">
                Buy credits
              </Link>
            </span>
          ),
        });
        return;
      }
      if (msg.includes("No holdings") || msg.includes("NO_HOLDINGS")) {
        toast({
          variant: "destructive",
          title: "No holdings found",
          description:
            "Upload screenshots or add rows in the Portfolio table, then try again.",
        });
      }
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleKeyPress = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const emptyStateText = useMemo(() => {
    if (hasHoldings) return null;
    return "No holdings available yet. Upload a screenshot or add rows manually to enable portfolio-aware chat.";
  }, [hasHoldings]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">Chat with your portfolio</CardTitle>
          <Badge variant="secondary" className="border-primary/20 bg-primary/10">
            Educational only
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Uses your latest saved holdings snapshot as context. Not investment
          advice.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.length > 0 && (
          <div className="max-h-[360px] overflow-y-auto rounded-xl border bg-muted/20 p-3 md:p-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <MemoizedMessage key={message.id} message={message as any} />
              ))}
              {isLoading && (
                <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
                  <ImSpinner className="h-4 w-4 animate-spin mr-2" />
                  Thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <Button
                key={prompt}
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-auto py-1.5"
                onClick={() => setInput(prompt)}
                disabled={!hasHoldings || isLoading}
              >
                {prompt}
              </Button>
            ))}
          </div>
        )}

        {emptyStateText ? (
          <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
            {emptyStateText}
          </div>
        ) : (
          <ChatForm
            handleSubmit={handleSubmit}
            input={input}
            handleInputChange={handleInputChange}
            handleKeyPress={handleKeyPress}
            isLoading={isLoading}
            stop={stop}
          />
        )}

        {error && (
          <p className="text-xs text-destructive">
            Request failed. Please try again.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
