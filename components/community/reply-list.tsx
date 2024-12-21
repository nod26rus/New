"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DiscussionReply } from "@/lib/types/discussion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface ReplyListProps {
  threadId: string;
}

export function ReplyList({ threadId }: ReplyListProps) {
  const [replies, setReplies] = useState<DiscussionReply[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReplies() {
      try {
        const response = await fetch(`/api/community/threads/${threadId}/replies`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        setReplies(data.replies);
      } catch (error) {
        console.error("Failed to load replies:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReplies();
  }, [threadId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-24" />
          </Card>
        ))}
      </div>
    );
  }

  if (!replies.length) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No replies yet. Be the first to reply!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {replies.map((reply, index) => (
        <motion.div
          key={reply.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {reply.user?.name || "Anonymous"} replied on{" "}
                    {new Date(reply.createdAt).toLocaleDateString()}
                  </p>
                  <div className="prose dark:prose-invert">
                    {reply.content}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{reply.likesCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}