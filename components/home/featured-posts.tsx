"use client";

import { useTranslations } from 'next-intl';
import { PostGrid } from "@/components/post-grid";

export function FeaturedPosts() {
  const t = useTranslations('home');

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t('featured')}
        </h2>
        <PostGrid limit={3} />
      </div>
    </section>
  );
}