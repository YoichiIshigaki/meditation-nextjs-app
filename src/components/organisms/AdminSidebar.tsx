"use client";

import { LayoutDashboard, FileText, FolderTree, ArrowLeft } from "lucide-react";
import { AdminNavItem } from "@/components/molecules/AdminNavItem";
import Link from "next/link";
import { useLanguage, useTranslation } from "@/i18n/client";

export const AdminSidebar = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-800">Admin</h1>
      </div>

      <nav className="space-y-2">
        <AdminNavItem
          href={`/${language}/admin`}
          icon={LayoutDashboard}
          label={t("admin:dashboard")}
        />
        <AdminNavItem
          href={`/${language}/admin/contents`}
          icon={FileText}
          label={t("admin:contents")}
        />
        <AdminNavItem
          href={`/${language}/admin/categories`}
          icon={FolderTree}
          label={t("admin:categories")}
        />
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <Link
          href={`/${language}/dashboard`}
          className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{t("admin:backToDashboard")}</span>
        </Link>
      </div>
    </aside>
  );
};
