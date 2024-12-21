"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const relatedPostsSettingsSchema = z.object({
  relatedPostsCount: z.string().regex(/^\d+$/, "Должно быть числом").transform(Number)
});

type RelatedPostsSettingsForm = z.infer<typeof relatedPostsSettingsSchema>;

export default function RelatedPostsSettingsPage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<RelatedPostsSettingsForm>({
    resolver: zodResolver(relatedPostsSettingsSchema),
    defaultValues: {
      relatedPostsCount: "3"
    }
  });

  async function onSubmit(data: RelatedPostsSettingsForm) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          related_posts_count: String(data.relatedPostsCount)
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
      <h1 className="text-3xl font-bold">Настройки похожих статей</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Отображение похожих статей</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="relatedPostsCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество похожих статей</FormLabel>
                    <FormDescription>
                      Сколько похожих статей показывать под каждой статьей
                    </FormDescription>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0"
                        max="10"
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