"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller, type FieldErrors } from "react-hook-form";
import { useLanguage, useTranslation } from "@/i18n/client";
import { AppIcon, TranslateText } from "@/components";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

type FormData = {
  email: string;
  password: string;
};

const ErrorMessage = <T extends Record<string, string>>(props: {
  errors: FieldErrors<T>;
  type: string;
  formKey: keyof typeof errors;
}) => {
  const { errors, type, formKey: key } = props;
  return errors[key]?.type === type ? (
    <TranslateText
      className="text-red-400 text-sm mt-1"
      translateKey={`validation:${String(key)}.${type}`}
    />
  ) : null;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    reValidateMode: "onBlur",
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const callbackUrl = searchParams.get("callbackUrl") || `/${language}`;

  const onSubmit = async (data: FormData) => {
    console.log({ data });
    await handleLogin();
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const form = getValues();
    try {
      const res = await signIn("credentials", {
        redirect: false,
        callbackUrl,
        ...form,
      });
      console.dir(res, { depth: null, maxArrayLength: null });

      if (res?.ok) {
        router.push(callbackUrl);
      } else {
        alert(t("login:error"));
      }
    } finally {
      setIsLoading(false);
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

      {/* ログインカード */}
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
                translateKey="login:welcome"
              />
              <p className="text-white/70 mt-2">{t("login:subtitle")}</p>
            </div>
          </div>

          {/* フォーム */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                      placeholder={t("login:email")}
                      className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  )}
                />
              </div>
              <ErrorMessage<FormData> errors={errors} type="required" formKey="email" />
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
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("login:password")}
                      className="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white/80 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <ErrorMessage<FormData> errors={errors} type="required" formKey="password" />
            </div>

            {/* パスワードを忘れた場合 */}
            <div className="text-right">
              <a
                href="#"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {t("login:forgot_password")}
              </a>
            </div>

            {/* ログインボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t("login:logging_in")}</span>
                </>
              ) : (
                <TranslateText element={null} translateKey="login:login" />
              )}
            </button>
          </form>

          {/* 区切り線 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/50">
                {t("login:or")}
              </span>
            </div>
          </div>

          {/* 新規登録リンク */}
          <p className="text-center text-white/70">
            {t("login:no_account")}{" "}
            <a
              href="#"
              className="text-white font-semibold hover:underline transition-all"
            >
              {t("login:sign_up")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
