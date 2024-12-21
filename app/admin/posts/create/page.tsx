"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Wand2 } from "lucide-react"
import { TagSelector } from "@/components/admin/posts/tag-selector"
import { Editor } from "@/components/admin/posts/editor"

const postSchema = z.object({
  title: z.string().min(1, "Обязательное поле"),
  slug: z.string().min(1, "Обязательное поле"),
  excerpt: z.string().min(1, "Обязательное поле"),
  content: z.string().min(1, "Обязательное поле"),
  featuredImage: z.string().url("Должен быть валидный URL").optional(),
  tags: z.array(z.string()),
  published: z.boolean(),
})

type PostForm = z.infer<typeof postSchema>

export default function CreatePostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      published: false,
      tags: [],
    },
  })

  async function onSubmit(data: PostForm) {
    setLoading(true)
    try {
      const response = await fetch("/api/posts/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error()
      
      toast.success("Статья создана")
      router.push("/admin/posts")
    } catch (error) {
      toast.error("Ошибка при создании статьи")
    } finally {
      setLoading(false)
    }
  }

  async function generateContent() {
    const title = form.getValues("title")
    if (!title) {
      toast.error("Сначала введите заголовок статьи")
      return
    }

    setGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: title,
          type: "text"
        }),
      })

      if (!response.ok) throw new Error()
      
      const { content } = await response.json()
      form.setValue("content", content)
      toast.success("Контент сгенерирован")
    } catch (error) {
      toast.error("Ошибка при генерации контента")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Создать статью</h1>
        <Button
          variant="outline"
          onClick={generateContent}
          disabled={generating}
        >
          <Wand2 className="w-4 h-4 mr-2" />
          {generating ? "Генерация..." : "Сгенерировать контент"}
        </Button>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Заголовок</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL (slug)</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Краткое описание</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={loading} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Содержание</FormLabel>
                  <FormControl>
                    <Editor {...field} disabled={loading} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Теги</FormLabel>
                  <FormControl>
                    <TagSelector 
                      value={field.value}
                      onChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/posts")}
                disabled={loading}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Сохранение..." : "Создать статью"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}