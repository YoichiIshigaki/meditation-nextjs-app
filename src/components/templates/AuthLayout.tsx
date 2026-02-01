"use client";
import { type ReactNode } from "react";
import { ToastContainer } from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import { AuthBackground } from "@/components/organisms";

type AuthLayoutProps = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-4">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <AuthBackground />
      {children}
    </div>
  );
};

// ToastなしのシンプルなLayout
export const AuthLayoutSimple = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-4">
      <AuthBackground />
      {children}
    </div>
  );
};
