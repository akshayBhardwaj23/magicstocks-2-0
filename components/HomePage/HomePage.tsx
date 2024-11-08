"use client";
import React, { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

import { KeyboardEvent } from "react";
import { ScrollArea } from "../ui/scroll-area";
import SignIn from "../SignIn/SignIn";
import { SignOut } from "../SignOut/SignOut";
import { useChat } from "ai/react";

import { ImSpinner } from "react-icons/im";
import MemoizedMessage from "../MemoizedMessage/MemoizedMessage";
import ChatForm from "../ChatForm/ChatForm";

const HomePage = () => {
  const { data: session } = useSession(); //Gets the session object to check the logged in user

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error,
    reload,
  } = useChat();

  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollToBottom();
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
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3"> */}
      {/* <div className="aspect-video rounded-xl bg-muted/50">1</div> */}
      {/* <div className="aspect-video rounded-xl bg-muted/50">2</div> */}
      {/* <div className="aspect-video rounded-xl bg-muted/50">3</div> */}
      {/* </div> */}
      <div className="min-h-[80vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-200px)]">
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
              <button type="button" onClick={() => reload()}>
                Retry
              </button>
            </>
          )}
        </ScrollArea>

        <ChatForm
          handleSubmit={handleSubmit}
          input={input}
          handleInputChange={handleInputChange}
          handleKeyPress={handleKeyPress}
          isLoading={isLoading}
          stop={stop}
        />

        {!session?.user?.id ? <SignIn /> : <SignOut />}
      </div>
    </div>
  );
};

export default HomePage;
