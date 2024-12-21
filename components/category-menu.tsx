"use client"

import { useCategories } from '@/lib/hooks/use-categories'
import { CategoryLink } from './category-link'
import { Skeleton } from './ui/skeleton'

export function CategoryMenu() {
  const { categories, loading } = useCategories()

  if (loading) {
    return (
      <nav className="flex items-center gap-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-20" />
        ))}
      </nav>
    )
  }

  if (!categories.length) {
    return null
  }

  return (
    <nav className="flex items-center gap-6 px-4 py-2 overflow-x-auto">
      {categories.map((category) => (
        <CategoryLink
          key={category.id}
          name={category.name}
          slug={category.slug}
          count={category.count}
        />
      ))}
    </nav>
  )
}