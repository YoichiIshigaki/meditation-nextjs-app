"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage, useTranslation } from "@/i18n/client";
import { useToast } from "@/hooks/useToast";
import { usePostApi } from "@/hooks/useApi";
import { ToastContainer } from "@/components/Toast";
import { AuthBackground, AuthCard } from "@/components/organisms";
import { PasswordInput } from "@/components/molecules";
import { GlassButton } from "@/components/atoms";
import {
  createResetPasswordFormSchema,
  type ResetPasswordFormSchema,
  type ResetPasswordSchema,
} from "@/schema/resetPassword";

type ResetPasswordResponse = {
  success: boolean;
  error?: string;
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [isSuccess, setIsSuccess] = useState(false);
  const [oobCode, setOobCode] = useState<string | null>(null);
  const { toasts, removeToast, error: showError } = useToast();

  const { mutateAsync: resetPassword, isPending: isLoading } = usePostApi<
    ResetPasswordSchema,
    ResetPasswordResponse
  >("auth/reset-password");

  useEffect(() => {
    const code = searchParams.get("oobCode");
    setOobCode(code);
  }, [searchParams]);

  const resetPasswordFormSchema = useMemo(() => createResetPasswordFormSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormSchema>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormSchema) => {
    if (!oobCode) {
      showError(t("reset_password:error_invalid_link"));
      return;
    }

    try {
      const result = await resetPassword({
        oobCode,
        newPassword: data.password,
      });

      if (result.success) {
        setIsSuccess(true);
      } else {
        showError(t("reset_password:error"));
      }
    } catch {
      showError(t("reset_password:error"));
    }
  };

  // 初期ロード中
  if (oobCode === null) {
    return null;
  }

  // 無効なリンク
  if (oobCode === "") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-4">
        <AuthBackground />
        <div className="relative w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6 text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto" />
            <h1 className="text-2xl font-bold text-white">
              {t("reset_password:error_invalid_link")}
            </h1>
            <p className="text-white/70">
              {t("reset_password:error_invalid_link_description")}
            </p>
            <GlassButton onClick={() => router.push(`/${language}/forgot-password`)}>
              {t("reset_password:request_new_link")}
            </GlassButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-4">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <AuthBackground />

      <AuthCard titleKey="reset_password:title" subtitle={t("reset_password:subtitle")}>
        {isSuccess ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-400" />
            </div>
            <p className="text-white">{t("reset_password:success")}</p>
            <GlassButton onClick={() => router.push(`/${language}/login`)}>
              {t("reset_password:go_to_login")}
            </GlassButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <PasswordInput
                  placeholder={t("reset_password:new_password")}
                  error={errors.password?.message}
                  {...field}
                />
              )}
            />

            <Controller
              control={control}
              name="confirm_password"
              render={({ field }) => (
                <PasswordInput
                  placeholder={t("reset_password:confirm_password")}
                  error={errors.confirm_password?.message}
                  {...field}
                />
              )}
            />

            <GlassButton
              type="submit"
              isLoading={isLoading}
              loadingText={t("reset_password:resetting")}
            >
              {t("reset_password:reset_password")}
            </GlassButton>
          </form>
        )}
      </AuthCard>
    </div>
  );
}
