"use client";

import { useEffect, useState } from "react";
import { NewsletterForm } from "./newsletter-form";
import { useTranslations } from 'next-intl';

export function NewsletterSection() {
  const [enabled, setEnabled] = useState(true);
  const t = useTranslations('newsletter');

  useEffect(() => {
    async function checkEnabled() {
      try {
        const response = await fetch("/api/settings/newsletter");
        if (!response.ok) throw new Error();
        const { newsletterEnabled } = await response.json();
        setEnabled(newsletterEnabled);
      } catch (error) {
        console.error("Failed to check newsletter status:", error);
      }
    }

    checkEnabled();
  }, []);

  if (!enabled) return null;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container px-4 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
        <p className="text-muted-foreground mb-6">{t('description')}</p>
        <NewsletterForm />
      </div>
    </section>
  );
}