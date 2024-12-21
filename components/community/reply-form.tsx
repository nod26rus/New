"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const replySchema = z.object({
  content: z.string().min(1, "Reply cannot be empty")
});

type ReplyForm = z.infer<typeof replySchema>;

interface ReplyFormProps {
  threadId: string;
  onSuccess?: () => void;
}

export function ReplyForm({ threadId, onSuccess }: ReplyFormProps) {
  const [loading, setLoading] = useState(false);
  const form = useForm<ReplyForm>({
    resolver: zodResolver(replySchema)
  });

  async function onSubmit(data: ReplyForm) {
    set Loading(true);
    try {
      const response = await fetch(`/api/community/threads/${threadId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error();
      
      form.reset();
      toast.success("Reply posted");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to post reply");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Post a Reply</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write your reply..."
                    rows={4}
                    disabled={loading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post Reply"}
          </Button>
        </form>
      </Form>
    </div>
  );
}