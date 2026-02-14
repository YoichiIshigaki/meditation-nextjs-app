"use client";

import Link from "next/link";
import { useLanguage, useTranslation } from "@/i18n/client";

export default function NotFound() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-4">
      <div className="text-center text-white">
        <p className="text-8xl font-bold opacity-80 mb-4">
          {t("error:not_found.title")}
        </p>
        <h1 className="text-2xl font-semibold mb-3">
          {t("error:not_found.heading")}
        </h1>
        <p className="text-white/70 mb-8">
          {t("error:not_found.description")}
        </p>
        <Link
          href={`/${language}`}
          className="inline-block px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors backdrop-blur-sm"
        >
          {t("error:not_found.back_home")}
        </Link>
      </div>
    </div>
  );
}
