import { z } from "zod";

// 翻訳関数の型
type TranslationFunction = (key: string) => string;

// API用のスキーマ
export const resetPasswordSchema = z.object({
  oobCode: z.string().min(1),
  newPassword: z.string().min(6),
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

// フォーム用のスキーマを生成する関数（翻訳対応）
export const createResetPasswordFormSchema = (t: TranslationFunction) =>
  z
    .object({
      password: z.string().min(6, t("reset_password:validation_password_min")),
      confirm_password: z.string().min(1, t("reset_password:validation_confirm_required")),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: t("reset_password:validation_password_mismatch"),
      path: ["confirm_password"],
    });

export type ResetPasswordFormSchema = z.infer<ReturnType<typeof createResetPasswordFormSchema>>;
