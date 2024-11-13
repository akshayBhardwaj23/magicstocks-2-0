import { auth } from "@/auth";
import BillingHistory from "@/components/BillingHistory/BillingHistory";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Profile | MagicStocks.ai - Future of Stock Analysis",
  description:
    "Access your billing history with MagicStocks.ai for detailed records of past payments and subscription changes. Stay on top of your account’s financial records.",
};

const BillingPage = async () => {
  const session = await auth();
  if (!session) return redirect("api/auth/signin");
  return <BillingHistory email={session.user?.email} />;
};

export default BillingPage;
