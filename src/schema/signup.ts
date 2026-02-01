import { z } from "zod";

// API用のスキーマ（confirm_passwordなし）
export const signUpSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
  first_name: z.string().min(1, "名は必須です"),
  last_name: z.string().min(1, "姓は必須です"),
  language: z.string(),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

// フォーム用のスキーマ（confirm_password付き）
export const signUpFormSchema = signUpSchema
  .extend({
    confirm_password: z.string().min(1, "パスワード確認は必須です"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "パスワードが一致しません",
    path: ["confirm_password"],
  });

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;
