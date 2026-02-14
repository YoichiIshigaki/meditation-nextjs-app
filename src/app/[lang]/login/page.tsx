"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useLanguage, useTranslation } from "@/i18n/client";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import { AuthBackground, AuthCard } from "@/components/organisms";
import { EmailInput, PasswordInput } from "@/components/molecules";
import { GlassButton, Divider } from "@/components/atoms";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [isLoading, setIsLoading] = useState(false);
  const {
    toasts,
    removeToast,
    error: showError,
    success: showSuccess,
  } = useToast();

  // 新規登録完了後のメッセージ表示
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      showSuccess(t("login:registered_success"));
    }
  }, [searchParams, showSuccess, t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const callbackUrl = searchParams.get("callbackUrl") || `/${language}`;

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        callbackUrl,
        email: data.email,
        password: data.password,
      });

      if (res?.ok) {
        router.push(callbackUrl);
      } else {
        showError(t("login:error"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-4">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <AuthBackground />

      <AuthCard titleKey="login:welcome" subtitle={t("login:subtitle")}>
        {/* フォーム */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* メール入力 */}
          <Controller
            control={control}
            name="email"
            rules={{ required: t("validation:email.required") }}
            render={({ field }) => (
              <EmailInput
                placeholder={t("login:email")}
                error={errors.email?.message}
                {...field}
              />
            )}
          />

          {/* パスワード入力 */}
          <Controller
            control={control}
            name="password"
            rules={{ required: t("validation:password.required") }}
            render={({ field }) => (
              <PasswordInput
                placeholder={t("login:password")}
                error={errors.password?.message}
                {...field}
              />
            )}
          />

          {/* パスワードを忘れた場合 */}
          <div className="text-right">
            <a
              href={`/${language}/forgot-password`}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {t("login:forgot_password")}
            </a>
          </div>

          {/* ログインボタン */}
          <GlassButton
            type="submit"
            isLoading={isLoading}
            loadingText={t("login:logging_in")}
          >
            {t("login:login")}
          </GlassButton>
        </form>

        {/* 区切り線 */}
        <Divider text={t("login:or")} />

        {/* 新規登録リンク */}
        <p className="text-center text-white/70">
          {t("login:no_account")}{" "}
          <a
            href={`/${language}/signup`}
            className="text-white font-semibold hover:underline transition-all"
          >
            {t("login:sign_up")}
          </a>
        </p>
      </AuthCard>
    </div>
  );
}
