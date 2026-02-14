"use client";
import { useMemo } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useLanguage, useTranslation } from "@/i18n/client";
import { useToast } from "@/hooks/useToast";
import { usePostApi } from "@/hooks/useApi";
import { ToastContainer } from "@/components/Toast";
import { AuthBackground, AuthCard } from "@/components/organisms";
import { EmailInput, PasswordInput, TextInput } from "@/components/molecules";
import { GlassButton, Divider } from "@/components/atoms";
import {
  createSignUpFormSchema,
  type SignUpFormSchema,
  type SignUpSchema,
} from "@/schema/signup";

type SignUpResponse = {
  success: boolean;
  userId?: string;
  error?: string;
  code?: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const {
    toasts,
    removeToast,
    success: showSuccess,
    error: showError,
  } = useToast();

  const { mutateAsync: signUp, isPending: isLoading } = usePostApi<
    SignUpSchema,
    SignUpResponse
  >("auth/signup");

  const signUpFormSchema = useMemo(() => createSignUpFormSchema(t), [t]);

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
    try {
      const result = await signUp({
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        language: data.language,
      });

      if (result.success) {
        showSuccess(t("signup:success"));

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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-4">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <AuthBackground />

      <AuthCard titleKey="signup:title" subtitle={t("signup:subtitle")}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 名前入力 */}
          <div className="grid grid-cols-2 gap-3">
            <Controller
              control={control}
              name="last_name"
              render={({ field }) => (
                <TextInput
                  placeholder={t("signup:last_name")}
                  icon={<User className="h-5 w-5" />}
                  error={errors.last_name?.message}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="first_name"
              render={({ field }) => (
                <TextInput
                  placeholder={t("signup:first_name")}
                  error={errors.first_name?.message}
                  {...field}
                />
              )}
            />
          </div>

          {/* メール入力 */}
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <EmailInput
                placeholder={t("signup:email")}
                error={errors.email?.message}
                {...field}
              />
            )}
          />

          {/* パスワード入力 */}
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <PasswordInput
                placeholder={t("signup:password")}
                error={errors.password?.message}
                {...field}
              />
            )}
          />

          {/* パスワード確認入力 */}
          <Controller
            control={control}
            name="confirm_password"
            render={({ field }) => (
              <PasswordInput
                placeholder={t("signup:confirm_password")}
                error={errors.confirm_password?.message}
                {...field}
              />
            )}
          />

          {/* 登録ボタン */}
          <GlassButton
            type="submit"
            isLoading={isLoading}
            loadingText={t("signup:signing_up")}
          >
            {t("signup:sign_up")}
          </GlassButton>
        </form>

        <Divider text={t("signup:or")} />

        <p className="text-center text-white/70">
          {t("signup:have_account")}{" "}
          <a
            href={`/${language}/login`}
            className="text-white font-semibold hover:underline transition-all"
          >
            {t("signup:login")}
          </a>
        </p>
      </AuthCard>
    </div>
  );
}
