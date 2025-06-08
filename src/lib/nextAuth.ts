import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import config from "@/config";
import { signInWithEmail } from './auth'

export const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if(process.env.IS_TEXT === 'true'){
          if (credentials?.email === 'user@example.com' && credentials?.password === 'password') {
            return { id: 'user-uid', name: 'test-user', email: 'user@example.com' };
          }
          return null;
        } else {
          return await signInWithEmail(credentials!.email, credentials!.password)
        } 
      },
    }),
  ],
  pages: {
    signIn: '/ja/login', // カスタムログインページを使う
  },
  secret: config.NEXTAUTH_SECRET,
})