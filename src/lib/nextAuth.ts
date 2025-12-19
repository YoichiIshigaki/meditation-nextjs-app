import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import config from "@/config";
import { signInWithEmail } from "./auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (process.env.IS_TEXT === "true") {
            if (
              credentials?.email === "user@example.com" &&
              credentials?.password === "password"
            ) {
              return {
                id: "user-uid",
                name: "test-user",
                email: "user@example.com",
                role: "admin",
              };
            }
            return null;
          } else {
            const user = await signInWithEmail(
              credentials!.email,
              credentials!.password,
            );
            return user;
          }
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/ja/login", // カスタムログインページを使う
  },
  secret: config.NEXTAUTH_SECRET,
} satisfies AuthOptions;

export const handler = NextAuth({
  ...authOptions,
});
