"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const likesSettingsSchema = z.object({
  likesEnabled: z.boolean()
});

type LikesSettingsForm = z.infer<typeof likesSettingsSchema>;

export default function LikesSettingsPage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<LikesSettingsForm>({
    resolver: zodResolver(likesSettingsSchema),
    defaultValues: {
      likesEnabled: true
    }
  });

  async function onSubmit(data: LikesSettingsForm) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          likesEnabled: String(data.likesEnabled)
        })
      });

      if (!response.ok) throw new Error();
      toast.success("Настройки лайков сохранены");
    } catch (error) {
      toast.error("Не удалось сохранить настройки");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Настройки лайков</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Управление лайками</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="likesEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Включить лайки
                      </FormLabel>
                      <FormDescription>
                        Показывать кнопку лайка и счетчик на страницах статей
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