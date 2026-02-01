"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useLanguage, useTranslation } from "@/i18n/client";
import { AppIcon, TranslateText } from "@/components";
import { usePostApi } from "@/hooks/useApi";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

type FormData = {
  email: string;
};

type ForgotPasswordResponse = {
  success: boolean;
  error?: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // usePostApi フック
  const { mutateAsync: forgotPassword, isPending: isLoading } = usePostApi<
    { email: string },
    ForgotPasswordResponse
  >("auth/forgot-password");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);

    try {
      const result = await forgotPassword({ email: data.email });

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(t("forgot_password:error"));
      }
    } catch {
      setError(t("forgot_password:error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-4">
      {/* 背景の装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* カード */}
      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6">
          {/* 戻るボタン */}
          <button
            onClick={() => router.push(`/${language}/login`)}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("forgot_password:back_to_login")}</span>
          </button>

          {/* ヘッダー */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AppIcon shape="square" size="lg" />
            </div>
            <div>
              <TranslateText
                element="h1"
                className="text-3xl font-bold text-white"
                translateKey="forgot_password:title"
              />
              <p className="text-white/70 mt-2">
                {t("forgot_password:subtitle")}
              </p>
            </div>
          </div>

          {isSuccess ? (
            /* 成功メッセージ */
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
              <p className="text-white">{t("forgot_password:success")}</p>
              <button
                onClick={() => router.push(`/${language}/login`)}
                className="w-full py-3.5 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200"
              >
                {t("forgot_password:back_to_login")}
              </button>
            </div>
          ) : (
            /* フォーム */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* エラーメッセージ */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* メール入力 */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/50" />
                  </div>
                  <Controller
                    control={control}
                    name="email"
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <input
                        type="email"
                        placeholder={t("forgot_password:email_placeholder")}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
                {errors.email?.type === "required" && (
                  <TranslateText
                    className="text-red-400 text-sm mt-1"
                    translateKey="validation:email.required"
                  />
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
                    <span>{t("forgot_password:sending")}</span>
                  </>
                ) : (
                  <span>{t("forgot_password:send_reset_link")}</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
