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

export const getUserData = async (email: string | undefined | null) => {
  await connectMongo();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
  };
};

export const updateUserProfileData = async (
  email: string | undefined | null,
  firstName: string | undefined | null,
  lastName: string | undefined | null,
  phone: string | undefined | null
) => {
  await connectMongo();

  const user = await User.findOneAndUpdate(
    { email },
    {
      firstName,
      lastName,
      phone,
    },
    { new: true }
  );
};
