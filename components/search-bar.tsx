"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  const router = useRouter();
  const t = useTranslations('common');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search')?.toString().trim();
    
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
      <Input
        name="search"
        type="search"
        placeholder={t('search.placeholder')}
        className="pl-10 h-12"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">{t('search.button')}</span>
      </Button>
    </form>
  );
}