"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage, useTranslation } from "@/i18n/client";
import { AppIcon, TranslateText } from "@/components";
import { ToastContainer } from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import { Mail, Lock, Eye, EyeOff, Loader2, User } from "lucide-react";
import { signUpFormSchema, type SignUpFormSchema } from "@/schema/signup";

export default function SignUpPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, removeToast, success: showSuccess, error: showError } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      language: language,
    },
  });

  const onSubmit = async (data: SignUpFormSchema) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
          language: data.language,
        }),
      });

      const result = await res.json();

      if (result.success) {
        showSuccess(t("signup:success"));

        // NextAuth経由で自動ログイン
        const signInResult = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (signInResult?.ok) {
          window.location.href = `/${language}`;
        } else {
          router.push(`/${language}/login?registered=true`);
        }
      } else {
        if (result.code === "auth/email-already-in-use") {
          showError(t("signup:error_email_exists"));
        } else {
          showError(t("signup:error"));
        }
      }
    } catch {
      showError(t("signup:error"));
    } finally {
      setIsLoading(false);
    }
  };

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
                translateKey="signup:title"
              />
              <p className="text-white/70 mt-2">{t("signup:subtitle")}</p>
            </div>
          </div>

          {/* フォーム */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 名前入力 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-white/50" />
                  </div>
                  <Controller
                    control={control}
                    name="last_name"
                    render={({ field }) => (
                      <input
                        type="text"
                        placeholder={t("signup:last_name")}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
                        {...field}
                      />
                    )}
                  />
                </div>
                {errors.last_name && (
                  <p className="text-red-400 text-sm mt-1">{errors.last_name.message}</p>
                )}
              </div>
              <div>
                <div className="relative">
                  <Controller
                    control={control}
                    name="first_name"
                    render={({ field }) => (
                      <input
                        type="text"
                        placeholder={t("signup:first_name")}
                        className="w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
                        {...field}
                      />
                    )}
                  />
                </div>
                {errors.first_name && (
                  <p className="text-red-400 text-sm mt-1">{errors.first_name.message}</p>
                )}
              </div>
            </div>

            {/* メール入力 */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/50" />
                </div>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <input
                      type="email"
                      placeholder={t("signup:email")}
                      className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
                      {...field}
                    />
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* パスワード入力 */}
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
                      placeholder={t("signup:password")}
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
                      placeholder={t("signup:confirm_password")}
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

            {/* 登録ボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t("signup:signing_up")}</span>
                </>
              ) : (
                <span>{t("signup:sign_up")}</span>
              )}
            </button>
          </form>

          {/* 区切り線 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/50">{t("signup:or")}</span>
            </div>
          </div>

          {/* ログインリンク */}
          <p className="text-center text-white/70">
            {t("signup:have_account")}{" "}
            <a
              href={`/${language}/login`}
              className="text-white font-semibold hover:underline transition-all"
            >
              {t("signup:login")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
