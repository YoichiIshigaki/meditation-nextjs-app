'use client'
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/i18n/client";

// 未ログイン時にログイン画面に遷移させる。
export const AuthenticationWrapper = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${language}/login`);
    }
  }, [status, language, router]);

  if (status === "loading") {
    return null;
  }
  return <>{children}</>;
};