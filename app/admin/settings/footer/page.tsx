"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

const socialLinkSchema = z.object({
  platform: z.string().min(1, "Required"),
  url: z.string().url("Must be a valid URL")
});

const footerSettingsSchema = z.object({
  socialLinks: z.array(socialLinkSchema),
  copyrightText: z.string().min(1, "Required")
});

type FooterSettingsForm = z.infer<typeof footerSettingsSchema>;

const platforms = [
  "github",
  "twitter",
  "facebook",
  "instagram",
  "linkedin",
  "youtube"
];

export default function FooterSettingsPage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<FooterSettingsForm>({
    resolver: zodResolver(footerSettingsSchema),
    defaultValues: {
      socialLinks: [],
      copyrightText: "© {year} Modern AI Blog. All rights reserved."
    }
  });

  async function onSubmit(data: FooterSettingsForm) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socialLinks: JSON.stringify(data.socialLinks),
          copyrightText: data.copyrightText
        })
      });

      if (!response.ok) throw new Error();
      toast.success("Footer settings saved");
    } catch (error) {
      toast.error("Failed to save footer settings");
    } finally {
      setLoading(false);
    }
  }

  const addSocialLink = () => {
    const currentLinks = form.getValues("socialLinks");
    form.setValue("socialLinks", [
      ...currentLinks,
      { platform: "", url: "" }
    ]);
  };

  const removeSocialLink = (index: number) => {
    const currentLinks = form.getValues("socialLinks");
    form.setValue("socialLinks", currentLinks.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Footer Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {form.watch("socialLinks").map((_, index) => (
                  <div key={index} className="flex gap-4">
                    <FormField
                      control={form.control}
                      name={`socialLinks.${index}.platform`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <select
                              {...field}
                              className="w-full h-10 px-3 rounded-md border"
                              disabled={loading}
                            >
                              <option value="">Select Platform</option>
                              {platforms.map(platform => (
                                <option key={platform} value={platform}>
                                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`socialLinks.${index}.url`}
                      render={({ field }) => (
                        <FormItem className="flex-[2]">
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="URL"
                              type="url"
                              disabled={loading}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addSocialLink}
                disabled={loading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Social Link
              </Button>

              <FormField
                control={form.control}
                name="copyrightText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Copyright Text</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
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