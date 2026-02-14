"use client";

import { signOut } from "next-auth/react";
import { signOut as firebaseSignOut } from "firebase/auth";
import { useLanguage } from "@/i18n/client";
import { getAuth } from "@/lib/firebase";

export const useLogout = () => {
  const { language } = useLanguage();

  const logout = async (redirectTo?: string) => {
    try {
      // 1. Firebase Auth のサインアウト
      const auth = await getAuth();
      await firebaseSignOut(auth);
    } catch (error) {
      console.warn("Firebase サインアウトエラー:", error);
    }

    // 2. NextAuth のサインアウト（セッションクッキー削除 + リダイレクト）
    await signOut({ callbackUrl: redirectTo ?? `/${language}/login` });
  };

  return { logout };
};
