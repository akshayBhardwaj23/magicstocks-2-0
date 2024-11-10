import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import connectMongo from "./lib/connect-mongo";
import User from "./models/User";
import { prisma } from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, Facebook],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;

        // Check if user exists
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Create new user if doesn't exist
          existingUser = await prisma.user.create({
            data: {
              email: user.email!,
              firstName: user.name?.split(" ")[0],
              lastName: user.name?.split(" ")[1],
              image: user.image,
              googleId: account?.provider === "google" ? user.id : undefined,
              facebookId:
                account?.provider === "facebook" ? user.id : undefined,
            },
          });
        }
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
    // async signIn(profile) {
    //   await connectMongo();

    //   let existingUser = await User.findOne({ email: profile.user.email });

    //   if (!existingUser) {
    //     existingUser = await User.create({
    //       email: profile.user.email,
    //       firstName: profile.user.name?.split(" ")[0],
    //       lastName: profile.user.name?.split(" ")[1],
    //       image: profile.user.image,
    //       googleId:
    //         profile.account?.provider === "google"
    //           ? profile.user.id
    //           : undefined,
    //       facebookId:
    //         profile.account?.provider === "facebook"
    //           ? profile.user.id
    //           : undefined,
    //     });
    //   }

    //   return true;
    // },
  },
});
