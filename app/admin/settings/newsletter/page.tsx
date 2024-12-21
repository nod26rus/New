"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const newsletterSettingsSchema = z.object({
  newsletterEnabled: z.boolean(),
  newsletterWelcomeText: z.string().min(1, "Required")
});

type NewsletterSettingsForm = z.infer<typeof newsletterSettingsSchema>;

export default function NewsletterSettingsPage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<NewsletterSettingsForm>({
    resolver: zodResolver(newsletterSettingsSchema),
    defaultValues: {
      newsletterEnabled: true,
      newsletterWelcomeText: "Thank you for subscribing to our newsletter!"
    }
  });

  async function onSubmit(data: NewsletterSettingsForm) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newsletter_enabled: String(data.newsletterEnabled),
          newsletter_welcome_text: data.newsletterWelcomeText
        })
      });

      if (!response.ok) throw new Error();
      toast.success("Newsletter settings saved");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Newsletter Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Newsletter Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="newsletterEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Enable Newsletter
                      </FormLabel>
                      <FormDescription>
                        Show newsletter subscription form in the footer
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
                name="newsletterWelcomeText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Welcome Message</FormLabel>
                    <FormDescription>
                      Message shown after successful subscription
                    </FormDescription>
                    <FormControl>
                      <Textarea 
                        {...field}
                        disabled={loading}
                        rows={3}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}