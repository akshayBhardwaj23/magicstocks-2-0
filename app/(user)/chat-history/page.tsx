import { auth } from "@/auth";
import ChatHistory from "@/components/ChatHistory/ChatHistory";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Profile | MagicStocks.ai - Future of Stock Analysis",
  description:
    "Easily review your chat history with MagicStocks.ai for past stock analyses and recommendations. Access valuable insights for future strategy planning.",
};

const ChatHistoryPage = async () => {
  const session = await auth();
  if (!session) return redirect("api/auth/signin");

  return <ChatHistory email={session.user?.email} />;
};

export default ChatHistoryPage;
