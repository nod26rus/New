import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface Tag {
  id: string
  name: string
  slug: string
}

interface TagListProps {
  tags: Tag[]
}

export function TagList({ tags }: TagListProps) {
  if (!tags.length) return null

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Теги</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link key={tag.id} href={`/tag/${tag.slug}`}>
            <Badge variant="secondary" className="hover:bg-secondary/80">
              #{tag.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  )
}