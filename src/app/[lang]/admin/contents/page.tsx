"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { AdminTemplate } from "@/components/templates/AdminTemplate";
import { ContentTable } from "@/components/organisms/ContentTable";
import { useLanguage, useTranslation } from "@/i18n/client";
import type { MeditationContent } from "@/models/meditation_content";
import type { Category } from "@/models/category";

export default function AdminContentsPage() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const [contents, setContents] = useState<MeditationContent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contentsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/contents"),
        fetch("/api/admin/categories"),
      ]);

      if (contentsRes.ok) {
        const contentsData = await contentsRes.json();
        setContents(contentsData.data || []);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin:deleteConfirm"))) return;

    try {
      const res = await fetch(`/api/admin/contents/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setContents(contents.filter((c) => c.id !== id));
        alert(t("admin:deleteSuccess"));
      } else {
        alert(t("admin:error"));
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      alert(t("admin:error"));
    }
  };

  if (isLoading) {
    return (
      <AdminTemplate>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {t("admin:contentList")}
          </h1>
          <Link
            href={`/${language}/admin/contents/new`}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {t("admin:createContent")}
          </Link>
        </div>

        <ContentTable
          contents={contents}
          categories={categories}
          onDelete={handleDelete}
        />
      </div>
    </AdminTemplate>
  );
}
