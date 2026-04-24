import { auth } from "@/auth";
import ChatHistory from "@/components/ChatHistory/ChatHistory";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Profile | MagicStocks.ai - Future of Stock Analysis",
  description:
    "Review past AI conversations for information and education. Not a record of investment advice or trade recommendations.",
};

const ChatHistoryPage = async () => {
  const session = await auth();
  if (!session) return redirect("api/auth/signin");

  return <ChatHistory email={session.user?.email} />;
};

export default ChatHistoryPage;
