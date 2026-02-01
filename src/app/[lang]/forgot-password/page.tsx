"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useLanguage, useTranslation } from "@/i18n/client";
import { usePostApi } from "@/hooks/useApi";
import { AuthBackground, AuthCard } from "@/components/organisms";
import { EmailInput } from "@/components/molecules";
import { GlassButton } from "@/components/atoms";

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

  const { mutateAsync: forgotPassword, isPending: isLoading } = usePostApi<
    { email: string; language: string },
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
      const result = await forgotPassword({ email: data.email, language });

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
      <AuthBackground />

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

          {isSuccess ? (
            /* 成功メッセージ */
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
              <p className="text-white">{t("forgot_password:success")}</p>
              <GlassButton onClick={() => router.push(`/${language}/login`)}>
                {t("forgot_password:back_to_login")}
              </GlassButton>
            </div>
          ) : (
            <>
              <AuthCard
                titleKey="forgot_password:title"
                subtitle={t("forgot_password:subtitle")}
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* エラーメッセージ */}
                  {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm">
                      {error}
                    </div>
                  )}

                  {/* メール入力 */}
                  <Controller
                    control={control}
                    name="email"
                    rules={{ required: t("validation:email.required") }}
                    render={({ field }) => (
                      <EmailInput
                        placeholder={t("forgot_password:email_placeholder")}
                        error={errors.email?.message}
                        {...field}
                      />
                    )}
                  />

                  {/* 送信ボタン */}
                  <GlassButton
                    type="submit"
                    isLoading={isLoading}
                    loadingText={t("forgot_password:sending")}
                  >
                    {t("forgot_password:send_reset_link")}
                  </GlassButton>
                </form>
              </AuthCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
