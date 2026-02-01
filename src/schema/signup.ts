import { z } from "zod";

// 翻訳関数の型
type TranslationFunction = (key: string) => string;

// API用のスキーマ（confirm_passwordなし）- サーバーサイド用
export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  first_name: z.string().min(1).max(20),
  last_name: z.string().min(1).max(20),
  language: z.string(),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

// フォーム用のスキーマを生成する関数（翻訳対応）
export const createSignUpFormSchema = (t: TranslationFunction) =>
  z
    .object({
      email: z.string().email(t("signup:validation_email_invalid")),
      password: z.string().min(6, t("signup:validation_password_min")),
      first_name: z
        .string()
        .min(1, t("signup:validation_first_name_required"))
        .max(20, t("signup:validation_first_name_max")),
      last_name: z
        .string()
        .min(1, t("signup:validation_last_name_required"))
        .max(20, t("signup:validation_last_name_max")),
      language: z.string(),
      confirm_password: z.string().min(1, t("signup:validation_confirm_password_required")),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: t("signup:validation_password_mismatch"),
      path: ["confirm_password"],
    });

export type SignUpFormSchema = z.infer<ReturnType<typeof createSignUpFormSchema>>;
