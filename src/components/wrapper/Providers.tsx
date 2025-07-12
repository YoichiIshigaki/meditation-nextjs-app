'use client';

import { FC } from 'react';
import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/i18n/client';

interface ProvidersProps {
  children: React.ReactNode;
  lang: string;
}

export const Providers: FC<ProvidersProps> = ({ children, lang }) =>  {
  return (
    <SessionProvider>
      <LanguageProvider initialLanguage={lang}>
        {children}
      </LanguageProvider>
    </SessionProvider>
  );
}