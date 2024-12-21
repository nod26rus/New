"use client";

import { useTranslations } from 'next-intl';
import { PostGrid } from "@/components/post-grid";

export function LatestPosts() {
  const t = useTranslations('home');

  return (
    <section className="py-16">
      <div className="container px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t('latest')}
        </h2>
        <PostGrid limit={6} />
      </div>
    </section>
  );
}