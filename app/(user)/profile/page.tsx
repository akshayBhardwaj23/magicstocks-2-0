import { auth } from "@/auth";
import Profile from "@/components/Profile/Profile";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Profile | MagicStocks.ai - Future of Stock Analysis",
  description:
    "Access and update your MagicStocks.ai profile. Manage your account details, personalize settings, and view your stock analysis history.",
};

const ProfilePage = async () => {
  const session = await auth();
  if (!session) return redirect("api/auth/signin");

  return <Profile />;
};

export default ProfilePage;
