"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Required"),
  bannerImage: z.string().url("Must be a valid URL"),
  funnelText: z.string().min(1, "Required"),
  logo: z.string().url("Must be a valid URL"),
});

type SiteSettingsForm = z.infer<typeof siteSettingsSchema>;

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<SiteSettingsForm>({
    resolver: zodResolver(siteSettingsSchema),
  });

  async function onSubmit(data: SiteSettingsForm) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error();
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Site Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" disabled={loading} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bannerImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" disabled={loading} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="funnelText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funnel Text</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={loading} />
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