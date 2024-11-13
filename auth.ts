import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google /*Facebook*/],
  callbacks: {
    async jwt({ token, user }) {
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
      try {
        const response = await fetch(
          `${process.env.NEXTAUTH_URL}/api/usercreate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
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
            }),
          }
        );
        if (!response.ok) {
          console.error("Failed to save user");
          return false;
        }
        console.log("success signin");
      } catch (error) {
        return false;
      }

      return true;
    },
  },
});
