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
import SuggestedText from "../SuggestedText/SuggestedText";
import { TrendingUp, ArrowRight } from "lucide-react";

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
          title: "Uh oh! No Credits Left.",
          description:
            "Please purchase more credits to continue using MagicStocks.ai",
          action: (
            <ToastAction altText="Buy Credits">
              <Link href="/manage-credits">Buy Credits</Link>
            </ToastAction>
          ),
        });
      //redirect("/manage-credits");
    },
  });

  const [firstMessage, wasFirstMessage] = useState<boolean>(true);
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { data: session } = useSession(); //Gets the session object to check the logged in user

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

  return (
    <div className="flex flex-1 flex-col h-full">
      {/* Mobile: Fixed input at bottom */}
      <div className="md:hidden flex flex-col h-full">
        <ScrollArea ref={scrollAreaRef} className="flex-1 pb-32">
          <div className="flex flex-col gap-4 p-4 max-w-4xl mx-auto">
            {messages.length === 0 && (
              <div className="flex justify-center mb-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 text-base font-semibold border border-red-400/20"
                >
                  <Link href="/portfolio" className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Portfolio Analysis
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
            {messages.map((message) => (
              <MemoizedMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          {isLoading && (
            <div className="flex justify-center p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ImSpinner className="animate-spin h-4 w-4" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="max-w-4xl mx-auto p-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="text-destructive font-medium mb-2">
                  An error occurred
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {error.message.includes("Credits expired")
                    ? "You've run out of credits. Please purchase more to continue."
                    : "Something went wrong. Please try again."}
                </div>
                <div className="flex gap-2">
                  {error.message.includes("Credits expired") && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/manage-credits">Buy Credits</Link>
                    </Button>
                  )}
                  <Button type="button" size="sm" onClick={() => reload()}>
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Fixed suggestions and input at bottom for mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
          {firstMessage && (
            <div className="border-t">
              <SuggestedText handleSuggestedText={handleSuggestedText} />
            </div>
          )}
          <div className="border-t">
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

      {/* Desktop: Normal layout */}
      <div className="hidden md:flex flex-1 flex-col min-h-0">
        <ScrollArea
          ref={scrollAreaRef}
          className="flex-1 h-[calc(100vh-160px)]"
        >
          <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
            {messages.length === 0 && (
              <div className="flex justify-center mb-6">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4 text-lg font-semibold border border-red-400/20"
                >
                  <Link href="/portfolio" className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6" />
                    Portfolio Analysis
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            )}
            {messages.map((message) => (
              <MemoizedMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          {isLoading && (
            <div className="flex justify-center p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ImSpinner className="animate-spin h-4 w-4" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="max-w-4xl mx-auto p-6">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="text-destructive font-medium mb-2">
                  An error occurred
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {error.message.includes("Credits expired")
                    ? "You've run out of credits. Please purchase more to continue."
                    : "Something went wrong. Please try again."}
                </div>
                <div className="flex gap-2">
                  {error.message.includes("Credits expired") && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/manage-credits">Buy Credits</Link>
                    </Button>
                  )}
                  <Button type="button" size="sm" onClick={() => reload()}>
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          )}
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
