import { z } from "zod";

type TranslationFunction = (key: string) => string;

// API用のスキーマ - サーバーサイド用
export const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(500),
  order: z.number().int().min(0),
});

export type CategorySchema = z.infer<typeof categorySchema>;

// 更新用スキーマ（すべてオプショナル）
export const categoryUpdateSchema = categorySchema.partial();

export type CategoryUpdateSchema = z.infer<typeof categoryUpdateSchema>;

// フォーム用のスキーマを生成する関数（翻訳対応）
export const createCategoryFormSchema = (t: TranslationFunction) =>
  z.object({
    name: z
      .string()
      .min(1, t("admin:validation_name_required"))
      .max(100, t("admin:validation_name_max")),
    slug: z
      .string()
      .min(1, t("admin:validation_slug_required"))
      .max(50, t("admin:validation_slug_max"))
      .regex(/^[a-z0-9-]+$/, t("admin:validation_slug_format")),
    description: z
      .string()
      .max(500, t("admin:validation_description_max_category")),
    order: z.number().int().min(0, t("admin:validation_order_min")),
  });

export type CategoryFormSchema = z.infer<
  ReturnType<typeof createCategoryFormSchema>
>;
