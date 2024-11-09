import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const ChatHistoryPage = async () => {
  const session = await auth();
  if (!session) return redirect("api/auth/signin");

  return <div>chat-history</div>;
};

export default ChatHistoryPage;
