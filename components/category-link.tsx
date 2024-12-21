import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CategoryLinkProps {
  name: string
  slug: string
  count?: number
  className?: string
}

export function CategoryLink({ name, slug, count, className }: CategoryLinkProps) {
  return (
    <Link
      href={`/category/${slug}`}
      className={cn(
        "text-muted-foreground hover:text-foreground transition-colors duration-200",
        "flex items-center gap-2",
        className
      )}
    >
      <span>{name}</span>
      {count !== undefined && (
        <span className="text-sm text-muted-foreground">({count})</span>
      )}
    </Link>
  )
}