"use server";
import { signIn } from "@/auth";

export const googleSingIn = async (): Promise<any> => {
  return await signIn("google");
};

export const facebookSingIn = async (): Promise<any> => {
  return await signIn("facebook");
};

export const singInMethod = async (): Promise<any> => {
  return await signIn();
};
