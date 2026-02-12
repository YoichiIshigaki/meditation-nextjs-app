"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FileUploadInput } from "@/components/atoms/FileUploadInput";
import type { Category } from "@/models/category";
import type { MeditationContent } from "@/models/meditation_content";
import { createMeditationContentFormSchema, type MeditationContentFormSchema } from "@/schema/meditationContent";
import { useLanguage, useTranslation } from "@/i18n/client";

type ContentFormProps = {
  categories: Category[];
  initialData?: MeditationContent;
  onSubmit: (data: MeditationContentFormSchema) => Promise<void>;
  isLoading?: boolean;
};

export const ContentForm = ({
  categories,
  initialData,
  onSubmit,
  isLoading = false,
}: ContentFormProps) => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const [imagePreview, setImagePreview] = useState<string | undefined>(initialData?.image_url);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const schema = createMeditationContentFormSchema(t);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MeditationContentFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category_id: initialData?.category_id || "",
      duration: initialData?.duration || 0,
      language: initialData?.language || "ja",
      image_url: initialData?.image_url || "",
      audio_url: initialData?.audio_url || "",
      video_url: initialData?.video_url || "",
    },
  });

  const submitLabel = initialData ? t("admin:submit") : t("admin:create");
  const submittingLabel = initialData ? t("admin:submitting") : t("admin:creating");

  const handleImageChange = async (file: File | null) => {
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: MeditationContentFormSchema) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("type", "image");
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        data.image_url = result.data.url;
      }
    }

    if (audioFile) {
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("type", "audio");
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        data.audio_url = result.data.url;
      }
    }

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("admin:title")}
        </label>
        <input
          {...register("title")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("admin:description")}
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("admin:category")}
          </label>
          <select
            {...register("category_id")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">{t("admin:selectCategory")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="mt-1 text-sm text-red-500">{errors.category_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("admin:duration")} ({t("admin:seconds")})
          </label>
          <input
            type="number"
            {...register("duration", { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-red-500">{errors.duration.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("admin:language")}
        </label>
        <select
          {...register("language")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="ja">日本語</option>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
        {errors.language && (
          <p className="mt-1 text-sm text-red-500">{errors.language.message}</p>
        )}
      </div>

      <FileUploadInput
        label={t("admin:imageUrl")}
        accept="image/*"
        maxSize={10 * 1024 * 1024}
        preview={imagePreview}
        onFileChange={handleImageChange}
        onClear={() => {
          setImagePreview(undefined);
          setImageFile(null);
          setValue("image_url", "");
        }}
      />

      <FileUploadInput
        label={t("admin:audioUrl")}
        accept="audio/*"
        maxSize={50 * 1024 * 1024}
        onFileChange={setAudioFile}
        onClear={() => {
          setAudioFile(null);
          setValue("audio_url", "");
        }}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("admin:videoUrl")}
        </label>
        <input
          {...register("video_url")}
          placeholder="https://..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {errors.video_url && (
          <p className="mt-1 text-sm text-red-500">{errors.video_url.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
    </form>
  );
};
