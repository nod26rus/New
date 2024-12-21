"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const adSettingsSchema = z.object({
  adHtmlCode: z.string(),
  adEnabled: z.boolean(),
  postListAdInterval: z.string()
    .regex(/^\d*$/, "Must be a number")
    .transform(v => v === "" ? "0" : v)
});

type AdSettingsForm = z.infer<typeof adSettingsSchema>;

export default function AdSettingsPage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<AdSettingsForm>({
    resolver: zodResolver(adSettingsSchema),
    defaultValues: {
      adHtmlCode: "",
      adEnabled: false,
      postListAdInterval: "0"
    }
  });

  async function onSubmit(data: AdSettingsForm) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adHtmlCode: data.adHtmlCode,
          adEnabled: String(data.adEnabled),
          postListAdInterval: data.postListAdInterval
        })
      });

      if (!response.ok) throw new Error();
      toast.success("Advertisement settings saved");
    } catch (error) {
      toast.error("Failed to save advertisement settings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Advertisement Settings</h1>
      
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Warning: The HTML code entered below will be rendered as-is. 
          You are responsible for ensuring the security and validity of the advertisement code.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Advertisement Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="adEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Enable Advertisements
                      </FormLabel>
                      <FormDescription>
                        Turn advertisements on or off globally
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
                name="postListAdInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post List Ad Interval</FormLabel>
                    <FormDescription>
                      Show an ad after every N posts (0 to disable)
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

              <FormField
                control={form.control}
                name="adHtmlCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advertisement HTML Code</FormLabel>
                    <FormDescription>
                      Paste your advertisement HTML code here. This code will be rendered in the designated ad spaces.
                    </FormDescription>
                    <FormControl>
                      <Textarea 
                        {...field}
                        rows={10}
                        placeholder="<!-- Paste your ad code here -->"
                        disabled={loading}
                        className="font-mono"
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