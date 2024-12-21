"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const recommendationsSettingsSchema = z.object({
  recommendationsEnabled: z.boolean(),
  recommendationsCount: z.string().regex(/^\d+$/, "Должно быть числом").transform(Number)
});

type RecommendationsSettingsForm = z.infer<typeof recommendationsSettingsSchema>;

export default function RecommendationsSettingsPage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<RecommendationsSettingsForm>({
    resolver: zodResolver(recommendationsSettingsSchema),
    defaultValues: {
      recommendationsEnabled: true,
      recommendationsCount: "6"
    }
  });

  async function onSubmit(data: RecommendationsSettingsForm) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommendations_enabled: String(data.recommendationsEnabled),
          recommendations_count: String(data.recommendationsCount)
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
      <h1 className="text-3xl font-bold">Настройки рекомендаций</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Персональные рекомендации</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="recommendationsEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Включить рекомендации
                      </FormLabel>
                      <FormDescription>
                        Показывать персональные рекомендации на основе просмотренных категорий
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={loading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recommendationsCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество рекомендаций</FormLabel>
                    <FormDescription>
                      Сколько рекомендованных статей показывать
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