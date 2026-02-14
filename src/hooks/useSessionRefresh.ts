"use client";

import { useSession } from "next-auth/react";

/**
 * ユーザー情報を更新した後にセッションを最新化するフック。
 * Firestoreのユーザー情報を更新した直後に refreshSession() を呼ぶことで、
 * NextAuthのJWTトークンとセッションが最新の情報に更新される。
 *
 * 使い方:
 *   const { refreshSession } = useSessionRefresh();
 *   await updateUser(...); // Firestoreを更新
 *   await refreshSession(); // セッションを同期
 */
export const useSessionRefresh = () => {
  const { update } = useSession();

  const refreshSession = async () => {
    await update();
  };

  return { refreshSession };
};
