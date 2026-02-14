"use client";
import { useState, useCallback } from "react";
import { type ToastMessage, type ToastType } from "@/components/Toast";

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string) => addToast("success", message),
    [addToast],
  );

  const error = useCallback(
    (message: string) => addToast("error", message),
    [addToast],
  );

  const info = useCallback(
    (message: string) => addToast("info", message),
    [addToast],
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
  };
};
