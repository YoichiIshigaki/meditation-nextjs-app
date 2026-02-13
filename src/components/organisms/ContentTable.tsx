"use client";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import type { MeditationContent } from "@/models/meditation_content";
import type { Category } from "@/models/category";
import { useLanguage, useTranslation } from "@/i18n/client";

type ContentTableProps = {
  contents: MeditationContent[];
  categories: Category[];
  onDelete: (id: string) => void;
};

export const ContentTable = ({
  contents,
  categories,
  onDelete,
}: ContentTableProps) => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "-";
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0
      ? `${m}${t("admin:minutes")}${s}${t("admin:seconds")}`
      : `${s}${t("admin:seconds")}`;
  };

  if (contents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        {t("admin:noContents")}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("admin:title")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("admin:category")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("admin:duration")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("admin:language")}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("admin:actions")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contents.map((content) => (
            <tr key={content.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {content.image_url && (
                    <img
                      src={content.image_url}
                      alt={content.title}
                      className="h-10 w-10 rounded-lg object-cover mr-3"
                    />
                  )}
                  <div className="text-sm font-medium text-gray-900">
                    {content.title}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getCategoryName(content.category_id)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDuration(content.duration)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {content.language}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  href={`/${language}/admin/contents/${content.id}/edit`}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <Edit className="w-5 h-5 inline" />
                </Link>
                <button
                  onClick={() => onDelete(content.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-5 h-5 inline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
