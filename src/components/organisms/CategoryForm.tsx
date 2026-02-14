"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { Category } from "@/models/category";
import {
  createCategoryFormSchema,
  type CategoryFormSchema,
} from "@/schema/category";
import { useLanguage, useTranslation } from "@/i18n/client";

type CategoryFormProps = {
  initialData?: Category;
  onSubmit: (data: CategoryFormSchema) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
};

export const CategoryForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: CategoryFormProps) => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const schema = createCategoryFormSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      order: initialData?.order || 0,
    },
  });

  const submitLabel = initialData ? t("admin:submit") : t("admin:create");
  const submittingLabel = initialData
    ? t("admin:submitting")
    : t("admin:creating");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("admin:name")}
        </label>
        <input
          {...register("name")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("admin:slug")}
        </label>
        <input
          {...register("slug")}
          placeholder="sleep, stress, focus..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {errors.slug && (
          <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("admin:description")}
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("admin:order")}
        </label>
        <input
          type="number"
          {...register("order", { valueAsNumber: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {errors.order && (
          <p className="mt-1 text-sm text-red-500">{errors.order.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {submittingLabel}
            </>
          ) : (
            submitLabel
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
          >
            {t("admin:cancel")}
          </button>
        )}
      </div>
    </form>
  );
};
