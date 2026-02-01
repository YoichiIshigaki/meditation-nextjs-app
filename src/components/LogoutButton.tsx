"use client";

import { useLogout } from "@/hooks/useLogout";

interface LogoutButtonProps {
  className?: string;
  clearStorage?: boolean;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = "",
  clearStorage = true,
}) => {
  const { logout } = useLogout();

  const handleLogout = async () => {
    const result = await logout({
      clearStorage,
      redirectTo: "/ja/login", // ログインページにリダイレクト
    });

    if (result.success) {
      console.log("ログアウト完了: セッションが完全にクリアされました");
    } else {
      console.error("ログアウトに失敗しました:", result.error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm ${className}`}
    >
      ログアウト
    </button>
  );
};
