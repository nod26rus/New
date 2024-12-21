"use client";

import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { SiteHeader } from '@/components/site-header';

interface ClientLayoutProps {
  children: React.ReactNode;
  messages: any;
  locale: string;
}

export function ClientLayout({ children, messages, locale }: ClientLayoutProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SiteHeader />
        <main>{children}</main>
        <Toaster />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}