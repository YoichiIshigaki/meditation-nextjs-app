"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage, useTranslation } from "@/i18n/client";
import { AppIcon, TranslateText } from "@/components";
import { ToastContainer } from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import { usePostApi } from "@/hooks/useApi";
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [oobCode, setOobCode] = useState<string | null>(null);
  const { toasts, removeToast, error: showError } = useToast();

  const { mutateAsync: resetPassword, isPending: isLoading } = usePostApi<
    ResetPasswordSchema,
    ResetPasswordResponse
  >("auth/reset-password");

  // URLからoobCodeを取得
  useEffect(() => {
    const code = searchParams.get("oobCode");
    setOobCode(code);
  }, [searchParams]);

  // 翻訳関数を使用してスキーマを生成
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

  // oobCodeがない場合のエラー表示
  if (oobCode === null) {
    return null; // 初期ロード中
  }

  if (oobCode === "") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        </div>
        <div className="relative w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6 text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto" />
            <h1 className="text-2xl font-bold text-white">{t("reset_password:error_invalid_link")}</h1>
            <p className="text-white/70">{t("reset_password:error_invalid_link_description")}</p>
            <button
              onClick={() => router.push(`/${language}/forgot-password`)}
              className="w-full py-3.5 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-white/90 transition-all duration-200"
            >
              {t("reset_password:request_new_link")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-4">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* 背景の装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* カード */}
      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6">
          {/* ヘッダー */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AppIcon shape="square" size="lg" />
            </div>
            <div>
              <TranslateText
                element="h1"
                className="text-3xl font-bold text-white"
                translateKey="reset_password:title"
              />
              <p className="text-white/70 mt-2">
                {t("reset_password:subtitle")}
              </p>
            </div>
          </div>

          {isSuccess ? (
            /* 成功メッセージ */
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
              <p className="text-white">{t("reset_password:success")}</p>
              <button
                onClick={() => router.push(`/${language}/login`)}
                className="w-full py-3.5 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200"
              >
                {t("reset_password:go_to_login")}
              </button>
            </div>
          ) : (
            /* フォーム */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* 新しいパスワード入力 */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/50" />
                  </div>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("reset_password:new_password")}
                        className="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
                        {...field}
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* パスワード確認入力 */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/50" />
                  </div>
                  <Controller
                    control={control}
                    name="confirm_password"
                    render={({ field }) => (
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("reset_password:confirm_password")}
                        className="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
                        {...field}
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white/80 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="text-red-400 text-sm mt-1">{errors.confirm_password.message}</p>
                )}
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{t("reset_password:resetting")}</span>
                  </>
                ) : (
                  <span>{t("reset_password:reset_password")}</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
