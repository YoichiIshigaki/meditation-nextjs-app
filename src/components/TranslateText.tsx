"use client";

import React from "react";
import { useLanguage, useTranslation } from "@/i18n/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const availableElement = ["p", "h1", "h2", "h3", "h4", "h5", "h6"] as const;

type TranslateText = {
  translateKey: string;
  className?: string;
  element?: (typeof availableElement)[number] | null;
};

export const TranslateText = ({
  translateKey,
  className,
  element = "p",
}: TranslateText) => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return element ? (
    React.createElement(element, { className }, t(translateKey))
  ) : (
    <>{t(translateKey)}</>
  );
};
