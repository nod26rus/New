"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const popularPostsSettingsSchema = z.object({
  popularPostsPeriod: z.enum(["day", "week", "month"]),
  popularPostsCount: z.string().regex(/^\d+$/, "Должно быть числом").transform(Number)
});

type PopularPostsSettingsForm = z.infer<typeof popularPostsSettingsSchema>;

export default function PopularPostsSettingsPage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<PopularPostsSettingsForm>({
    resolver: zodResolver(popularPostsSettingsSchema),
    defaultValues: {
      popularPostsPeriod: "week",
      popularPostsCount: "6"
    }
  });

  async function onSubmit(data: PopularPostsSettingsForm) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          popular_posts_period: data.popularPostsPeriod,
          popular_posts_count: String(data.popularPostsCount)
        })
      });

      if (!response.ok) throw new Error();
      toast.success("Настройки сохранены");
    } catch (error) {
      toast.error("Не удалось сохранить настройки");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Настройки популярных статей</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Параметры отображения</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="popularPostsPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Период популярности</FormLabel>
                    <FormDescription>
                      За какой период учитывать просмотры
                    </FormDescription>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите период" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="day">День</SelectItem>
                        <SelectItem value="week">Неделя</SelectItem>
                        <SelectItem value="month">Месяц</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="popularPostsCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество статей</FormLabel>
                    <FormDescription>
                      Сколько популярных статей показывать
                    </FormDescription>
                    <FormControl>
                      <Input 
                        {...field}
                        type="number"
                        min="1"
                        max="12"
                        disabled={loading}
                      />
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
  );
}