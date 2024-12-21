"use client";

import { useEffect, useState } from "react";
import { Category } from "@/lib/types/category";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  className?: string;
}

export function CategoryNav({ className }: CategoryNavProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/admin/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <nav className={cn("flex items-center gap-6 px-4 py-2", className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 w-20 bg-muted animate-pulse rounded" />
        ))}
      </nav>
    );
  }

  return (
    <nav className={cn("flex items-center gap-6 px-4 py-2 overflow-x-auto", className)}>
      {categories.map((category) => (
        <a
          key={category.id}
          href={`/category/${category.slug}`}
          className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
        >
          {category.name}
        </a>
      ))}
    </nav>
  );
}