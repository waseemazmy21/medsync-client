"use client";

import { LanguageProvider } from '@/context/LanguageContext';
import '@/lib/i18n';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
