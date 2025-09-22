import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PortfolioPageClient from "@/components/PortfolioPageClient";
import React from "react";

export default async function PortfolioPage() {
  const session = await auth();
  if (!session) return redirect("/api/auth/signin");
  return <PortfolioPageClient />;
}
