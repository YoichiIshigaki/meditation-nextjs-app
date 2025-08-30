"use client";

import { FC } from "react";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/i18n/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

interface ProvidersProps {
  children: React.ReactNode;
  lang: string;
}

// Create a client
const queryClient = new QueryClient();

export const Providers: FC<ProvidersProps> = ({ children, lang }) => {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider initialLanguage={lang}>{children}</LanguageProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};
