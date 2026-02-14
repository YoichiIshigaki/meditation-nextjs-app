import { AdminTemplate } from "@/components/templates/AdminTemplate";
import { FileText, FolderTree } from "lucide-react";
import Link from "next/link";
import { getTranslation } from "@/i18n/server";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function AdminDashboardPage({ params }: Props) {
  const { lang } = await params;
  const { t } = await getTranslation(lang);

  return (
    <AdminTemplate>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {t("admin:adminDashboard")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href={`/${lang}/admin/contents`}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FileText className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {t("admin:contents")}
                </h2>
                <p className="text-gray-500">{t("admin:contentList")}</p>
              </div>
            </div>
          </Link>

          <Link
            href={`/${lang}/admin/categories`}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FolderTree className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {t("admin:categories")}
                </h2>
                <p className="text-gray-500">{t("admin:categoryList")}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AdminTemplate>
  );
}
