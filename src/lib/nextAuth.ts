import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import config from "@/config";

export const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // 実際には DB チェックなどを行う
        console.log({ credentials });
        if (credentials?.email === 'user@example.com' && credentials?.password === 'password') {
          return { id: '1', name: 'User', email: 'user@example.com' };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/ja/login', // カスタムログインページを使う
  },
  secret: config.NEXTAUTH_SECRET,
})