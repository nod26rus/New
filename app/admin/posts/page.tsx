"use client"

import { useEffect, useState } from "react"
import { PostList } from "@/components/admin/posts/post-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Статьи</h1>
        <Button asChild>
          <Link href="/admin/posts/create">
            <Plus className="w-4 h-4 mr-2" />
            Создать статью
          </Link>
        </Button>
      </div>
      <PostList />
    </div>
  )
}