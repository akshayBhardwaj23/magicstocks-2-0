import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import connectMongo from "./lib/connect-mongo";
import User from "./models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, Facebook],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
    async signIn(profile) {
      await connectMongo();

      let existingUser = await User.findOne({ email: profile.user.email });

      if (!existingUser) {
        existingUser = await User.create({
          email: profile.user.email,
          firstName: profile.user.name?.split(" ")[0],
          lastName: profile.user.name?.split(" ")[1],
          image: profile.user.image,
          googleId:
            profile.account?.provider === "google"
              ? profile.user.id
              : undefined,
          facebookId:
            profile.account?.provider === "facebook"
              ? profile.user.id
              : undefined,
        });
      }

      return true;
    },
  },
});
