import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const UpgradePage = async () => {
  const session = await auth();
  if (!session) return redirect("api/auth/signin");

  return <div>Upgrade </div>;
};

export default UpgradePage;
