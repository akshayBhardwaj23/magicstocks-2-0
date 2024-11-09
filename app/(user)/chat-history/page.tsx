import { auth } from "@/auth";
import ChatHistory from "@/components/ChatHistory/ChatHistory";
import { redirect } from "next/navigation";
import React from "react";

const ChatHistoryPage = async () => {
  const session = await auth();
  if (!session) return redirect("api/auth/signin");

  return <ChatHistory email={session.user?.email} />;
};

export default ChatHistoryPage;
