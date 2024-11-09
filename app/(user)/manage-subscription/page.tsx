import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const SubscriptionPage = async () => {
  const session = await auth();
  if (!session) return redirect("api/auth/signin");

  return <div>Manage Subscription</div>;
};

export default SubscriptionPage;
