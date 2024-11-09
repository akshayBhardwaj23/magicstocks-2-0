import { auth } from "@/auth";
import Profile from "@/components/Profile/Profile";
import { redirect } from "next/navigation";
import React from "react";

const ProfilePage = async () => {
  const session = await auth();
  if (!session) return redirect("api/auth/signin");

  return <Profile />;
};

export default ProfilePage;
