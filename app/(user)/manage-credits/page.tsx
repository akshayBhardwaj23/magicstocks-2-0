import { auth } from "@/auth";
import ManageCredits from "@/components/ManageCredits/ManageCredits";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Profile | MagicStocks.ai - Future of Stock Analysis",
  description:
    "Check and manage your available credits for AI-powered stock analysis. Stay informed about your usage and add more credits as needed.",
};

const CreditsPage = async () => {
  const session = await auth();
  if (!session) return redirect("api/auth/signin");

  return <ManageCredits email={session.user?.email} />;
};

export default CreditsPage;
