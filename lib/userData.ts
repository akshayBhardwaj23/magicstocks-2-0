"use server";

import User from "@/models/User";
import connectMongo from "./connect-mongo";
import { revalidatePath } from "next/cache";

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

  await User.findOneAndUpdate(
    { email },
    {
      firstName,
      lastName,
      phone,
    },
    { new: true }
  );
};

export const updateMessageCount = async (
  email: string | null | undefined,
  planType: string
) => {
  let count = 0;
  if (planType === "Starter") {
    count = 20;
  } else if (planType === "Pro") {
    count = 300;
  }

  try {
    await User.findOneAndUpdate(
      { email },
      { $inc: { current_messages: count } }, // Increment current_messages by count
      { new: true } // Option to return the updated user document
    );
    revalidatePath("/manage-subscription");
  } catch (error) {
    console.error("Error updating message count:", error);
    throw new Error("Failed to update message count");
  }
};
