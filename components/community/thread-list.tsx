"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DiscussionThread } from "@/lib/types/discussion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, MessageSquare } from "lucide-react";

interface ThreadListProps {
  search?: string;
  tag?: string;
}

export function ThreadList({ search, tag }: ThreadListProps) {
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadThreads() {
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (tag) params.append("tag", tag);

        const response = await fetch(`/api/community/threads?${params}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        setThreads(data.threads);
      } catch (error) {
        console.error("Failed to load threads:", error);
      } finally {
        setLoading(false);
      }
    }

    loadThreads();
  }, [search, tag]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-32" />
          </Card>
        ))}
      </div>
    );
  }

  if (!threads.length) {
    return (
      <p className="text-center text-muted-foreground py-12">
        No discussions found
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <motion.div
          key={thread.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href={`/community/${thread.id}`}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold hover:text-primary">
                      {thread.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Posted by {thread.user?.name || "Anonymous"} on{" "}
                      {new Date(thread.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{thread.likesCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm">{thread.repliesCount}</span>
                    </div>
                  </div>
                </div>

                {thread.tags.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {thread.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}