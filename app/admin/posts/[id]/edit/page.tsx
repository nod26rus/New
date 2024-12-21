"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { TagSelector } from "@/components/admin/posts/tag-selector";
import { Editor } from "@/components/admin/posts/editor";

const postSchema = z.object({
  title: z.string().min(1, "Required"),
  slug: z.string().min(1, "Required"),
  excerpt: z.string().min(1, "Required"),
  content: z.string().min(1, "Required"),
  featuredImage: z.string().url("Must be a valid URL").optional(),
  tags: z.array(z.string()),
  published: z.boolean(),
});

type PostForm = z.infer<typeof postSchema>;

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      published: false,
      tags: [],
    },
  });

  useEffect(() => {
    async function loadPost() {
      try {
        const response = await fetch(`/api/posts/admin/${params.id}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        form.reset(data);
      } catch (error) {
        toast.error("Failed to load post");
        router.push("/admin/posts");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [params.id, form, router]);

  async function onSubmit(data: PostForm) {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/admin/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error();
      
      toast.success("Post updated");
      router.push("/admin/posts");
    } catch (error) {
      toast.error("Failed to update post");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Post</h1>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL (slug)</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={loading} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Editor {...field} disabled={loading} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagSelector 
                      value={field.value}
                      onChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/posts")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}