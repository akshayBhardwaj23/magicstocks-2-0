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
  // const [scrollAreaHeight, setScrollAreaHeight] = useState("100vh");
  // const chatFormRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { data: session } = useSession(); //Gets the session object to check the logged in user

  useEffect(() => {
    scrollToBottom();
    if (messages.length > 0) wasFirstMessage(false);
  }, [messages]);

  // useEffect(() => {
  //   const updateScrollAreaHeight = () => {
  //     const chatFormHeightPx = chatFormRef.current?.offsetHeight || 0;
  //     const chatFormHeightVh = (chatFormHeightPx / window.innerHeight) * 100; // Convert px to vh

  //     setScrollAreaHeight(`h-[calc(100vh-${chatFormHeightVh}vh-20vh)]`);
  //   };
  //   updateScrollAreaHeight();

  //   // Recalculate height on window resize
  //   window.addEventListener("resize", updateScrollAreaHeight);

  //   return () => window.removeEventListener("resize", updateScrollAreaHeight);
  // }, []);

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
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3"> */}
      {/* <div className="aspect-video rounded-xl bg-muted/50">1</div> */}
      {/* <div className="aspect-video rounded-xl bg-muted/50">2</div> */}
      {/* <div className="aspect-video rounded-xl bg-muted/50">3</div> */}
      {/* </div> */}
      <div className="min-h-[80vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <ScrollArea
          ref={scrollAreaRef}
          //className="h-[calc(100vh-30vh)] md:h-[calc(100vh-15vh)] lg:h-[calc(100vh-22vh)] xl:h-[calc(100vh-20vh)] 2xl:h-[calc(100vh-25vh)]"
          className="h-[calc(100vh-240px)] md:h-[calc(100vh-180px)]"
          //className={`${scrollAreaHeight}`}
        >
          <div className="flex flex-col gap-4 p-4">
            {messages.map((message) => (
              <MemoizedMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          {isLoading && (
            <div>
              <div className="flex items-start justify-end">
                <ImSpinner className="animate-spin" />
              </div>
            </div>
          )}
          {error && (
            <>
              <div>An error occurred.</div>
              {error.message.includes("Credits expired") && (
                <p className="bg-gray-200 mt-4 p-4">
                  Please purchase more credits to continue{" "}
                  <Button variant="link">Buy Credits</Button>
                </p>
              )}
              <Button type="button" className="mt-4" onClick={() => reload()}>
                Retry
              </Button>
            </>
          )}
          {firstMessage && (
            <SuggestedText handleSuggestedText={handleSuggestedText} />
          )}
        </ScrollArea>

        {/* <div ref={chatFormRef}> */}
        <ChatForm
          handleSubmit={handleSubmit}
          input={input}
          handleInputChange={handleInputChange}
          handleKeyPress={handleKeyPress}
          isLoading={isLoading}
          stop={stop}
        />
        {/* </div> */}
      </div>
    </div>
  );
};

export default HomePage;
