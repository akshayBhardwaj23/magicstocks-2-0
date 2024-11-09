import { auth } from "@/auth";
import ManageCredits from "@/components/ManageCredits/ManageCredits";
import { redirect } from "next/navigation";
import React from "react";

const CreditsPage = async () => {
  const session = await auth();
  if (!session) return redirect("api/auth/signin");

  return <ManageCredits email={session.user?.email} />;
};

export default CreditsPage;
