"use client";

import { Edit, Trash2, GripVertical } from "lucide-react";
import type { Category } from "@/models/category";
import { useLanguage, useTranslation } from "@/i18n/client";

type CategoryListProps = {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
};

export const CategoryList = ({
  categories,
  onEdit,
  onDelete,
}: CategoryListProps) => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        {t("admin:noCategories")}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-10"></th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("admin:name")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("admin:slug")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("admin:order")}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("admin:actions")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="pl-4">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {category.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {category.slug}
                </code>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {category.order}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(category)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <Edit className="w-5 h-5 inline" />
                </button>
                <button
                  onClick={() => onDelete(category.id)}
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
