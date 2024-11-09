"use server";

import User from "@/models/User";
import connectMongo from "./connect-mongo";

export const getMessagesCount = async (email: string | undefined | null) => {
  await connectMongo();

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  return user.current_messages;
};
