import NextAuth, { type AuthOptions, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import config from "@/config";
import { signInWithEmail } from "@/lib/auth";
import { getAuth } from "@/lib/firebase";
import { getNotThrow } from "@/models/user/get"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const email = credentials?.email;
          const password = credentials?.password;
          if (!email || !password) return null;

          if (
            process.env.IS_TEST === "true" &&
            process.env.NODE_ENV === "development"
          ) {
            if (
              email === process.env.MOCK_USER_EMAIL &&
              password === process.env.MOCK_USER_PASSPORD
            ) {
              return {
                id: "user-uid",
                name: "test-user",
                email: "user@example.com",
                role: "root",
              } satisfies User;
            }
            return null;
          } else {
            const auth = await getAuth();
            const user = await signInWithEmail(
              auth,
              email,
              password,
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
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.role = user.role;
      }
      // セッションの更新
      if (trigger === "update") {
        const user = await getNotThrow(token.id as string);
        if (user) {
          token.name = `${user.first_name} ${user.last_name}`.trim();
          token.image = user.thumbnail_url;
          token.role = user.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // https://next-auth.js.org/getting-started/client#updating-the-session
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.role = (token.role as string) ?? "user";
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
