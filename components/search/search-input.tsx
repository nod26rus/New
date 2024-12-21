"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

interface SearchInputProps {
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function SearchInput({ className, size = "default" }: SearchInputProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const t = useTranslations('common');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  const sizes = {
    sm: "h-8 text-sm",
    default: "h-10",
    lg: "h-12 text-lg"
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <Input
        type="search"
        placeholder={t('search.placeholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`pr-10 ${sizes[size]}`}
      />
      <Button 
        type="submit" 
        variant="ghost" 
        size="icon"
        className={`absolute right-0 top-0 ${sizes[size]}`}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">{t('search.button')}</span>
      </Button>
    </form>
  );
}