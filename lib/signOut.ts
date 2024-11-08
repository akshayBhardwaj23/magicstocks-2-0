"use server";

import { signOut } from "@/auth";

export const signOutMethod = async (): Promise<any> => {
  return await signOut();
};
