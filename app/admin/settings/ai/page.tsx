"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const aiSettingsSchema = z.object({
  chatGptApiKey: z.string().min(1, "Required"),
  dalleApiKey: z.string().min(1, "Required"),
  dailyChatGptLimit: z.string().regex(/^\d+$/, "Must be a number"),
  dailyDalleLimit: z.string().regex(/^\d+$/, "Must be a number"),
  morningPrompt: z.string().min(1, "Required"),
  eveningPrompt: z.string().min(1, "Required")
});

type AISettingsForm = z.infer<typeof aiSettingsSchema>;

export default function AISettingsPage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<AISettingsForm>({
    resolver: zodResolver(aiSettingsSchema),
    defaultValues: {
      chatGptApiKey: "",
      dalleApiKey: "",
      dailyChatGptLimit: "100",
      dailyDalleLimit: "50",
      morningPrompt: "Write a motivational morning message about:",
      eveningPrompt: "Reflect on the day and write about:"
    }
  });

  async function onSubmit(data: AISettingsForm) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatgpt_api_key: data.chatGptApiKey,
          dalle_api_key: data.dalleApiKey,
          daily_chatgpt_limit: data.dailyChatGptLimit,
          daily_dalle_limit: data.dailyDalleLimit,
          morning_prompt: data.morningPrompt,
          evening_prompt: data.eveningPrompt
        })
      });

      if (!response.ok) throw new Error();
      toast.success("AI settings saved");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="chatGptApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ChatGPT API Key</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" disabled={loading} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dalleApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DALL-E API Key</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" disabled={loading} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dailyChatGptLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily ChatGPT Limit</FormLabel>
                      <FormDescription>
                        Maximum number of ChatGPT requests per user per day
                      </FormDescription>
                      <FormControl>
                        <Input {...field} type="number" min="0" disabled={loading} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailyDalleLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily DALL-E Limit</FormLabel>
                      <FormDescription>
                        Maximum number of DALL-E requests per user per day
                      </FormDescription>
                      <FormControl>
                        <Input {...field} type="number" min="0" disabled={loading} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="morningPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Morning Prompt Template</FormLabel>
                    <FormDescription>
                      Base prompt for generating morning content
                    </FormDescription>
                    <FormControl>
                      <Textarea {...field} disabled={loading} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eveningPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Evening Prompt Template</FormLabel>
                    <FormDescription>
                      Base prompt for generating evening content
                    </FormDescription>
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