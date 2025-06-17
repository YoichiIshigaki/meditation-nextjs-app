'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/i18n/client';

interface ProvidersProps {
  children: React.ReactNode;
  lang: string;
}

export function Providers({ children, lang }: ProvidersProps) {
  return (
    <SessionProvider>
      <LanguageProvider initialLanguage={lang}>
        {children}
      </LanguageProvider>
    </SessionProvider>
  );
}