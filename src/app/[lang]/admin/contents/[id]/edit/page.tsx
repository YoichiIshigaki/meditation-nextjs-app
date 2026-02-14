"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminTemplate } from "@/components/templates/AdminTemplate";
import { ContentForm } from "@/components/organisms/ContentForm";
import { useLanguage, useTranslation } from "@/i18n/client";
import type { Category } from "@/models/category";
import type { MeditationContent } from "@/models/meditation_content";
import type { MeditationContentFormSchema } from "@/schema/meditationContent";

export default function AdminContentEditPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const [content, setContent] = useState<MeditationContent | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, categoriesRes] = await Promise.all([
          fetch(`/api/admin/contents/${contentId}`),
          fetch("/api/admin/categories"),
        ]);

        if (contentRes.ok) {
          const contentData = await contentRes.json();
          setContent(contentData.data);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [contentId]);

  const handleSubmit = async (data: MeditationContentFormSchema) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/contents/${contentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert(t("admin:updateSuccess"));
        router.push(`/${language}/admin/contents`);
      } else {
        alert(t("admin:error"));
      }
    } catch (error) {
      console.error("Error updating content:", error);
      alert(t("admin:error"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <AdminTemplate>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </AdminTemplate>
    );
  }

  if (!content) {
    return (
      <AdminTemplate>
        <div className="text-center py-8 text-gray-500">
          {t("admin:notFound")}
        </div>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {t("admin:editContent")}
        </h1>

        <div className="bg-white rounded-lg shadow p-6">
          <ContentForm
            categories={categories}
            initialData={content}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </AdminTemplate>
  );
}
