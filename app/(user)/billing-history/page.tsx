import { auth } from "@/auth";
import BillingHistory from "@/components/BillingHistory/BillingHistory";
import { redirect } from "next/navigation";
import React from "react";

const BillingPage = async () => {
  const session = await auth();
  if (!session) return redirect("api/auth/signin");
  return <BillingHistory email={session.user?.email} />;
};

export default BillingPage;
