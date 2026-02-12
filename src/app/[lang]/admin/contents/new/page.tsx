"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminTemplate } from "@/components/templates/AdminTemplate";
import { ContentForm } from "@/components/organisms/ContentForm";
import { useLanguage, useTranslation } from "@/i18n/client";
import type { Category } from "@/models/category";
import type { MeditationContentFormSchema } from "@/schema/meditationContent";

export default function AdminContentNewPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (data: MeditationContentFormSchema) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/contents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert(t("admin:createSuccess"));
        router.push(`/${language}/admin/contents`);
      } else {
        alert(t("admin:error"));
      }
    } catch (error) {
      console.error("Error creating content:", error);
      alert(t("admin:error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminTemplate>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">{t("admin:createContent")}</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <ContentForm
            categories={categories}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </AdminTemplate>
  );
}
