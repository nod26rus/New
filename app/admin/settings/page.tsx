"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const settingsSchema = z.object({
  siteName: z.string().min(1, "Обязательное поле"),
  siteDescription: z.string().min(1, "Обязательное поле"),
  openaiApiKey: z.string().min(1, "Обязательное поле"),
  gptDailyLimit: z.string().regex(/^\d+$/, "Должно быть числом"),
  dalleDailyLimit: z.string().regex(/^\d+$/, "Должно быть числом"),
  basePrompt: z.string().min(1, "Обязательное поле"),
})

type SettingsForm = z.infer<typeof settingsSchema>

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
  })

  async function onSubmit(data: SettingsForm) {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error()
      toast.success("Настройки сохранены")
    } catch (error) {
      toast.error("Ошибка при сохранении настроек")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Настройки</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Основные настройки</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название сайта</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siteDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание сайта</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={loading} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="openaiApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OpenAI API Key</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" disabled={loading} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gptDailyLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Лимит GPT (в день)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" disabled={loading} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dalleDailyLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Лимит DALL-E (в день)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" disabled={loading} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="basePrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Базовый промпт для генерации</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={loading} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading}>
                {loading ? "Сохранение..." : "Сохранить настройки"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}