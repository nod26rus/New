"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, MoreVertical, Flag, Bookmark, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ThreadActionsProps {
  threadId: string;
  isLiked: boolean;
  likesCount: number;
  onDelete?: () => void;
}

export function ThreadActions({ threadId, isLiked, likesCount, onDelete }: ThreadActionsProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(likesCount);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (!session) {
      toast.error("Please sign in to like threads");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/community/threads/${threadId}/like`, {
        method: liked ? "DELETE" : "POST"
      });

      if (!response.ok) throw new Error();
      
      setLiked(!liked);
      setCount(prev => liked ? prev - 1 : prev + 1);
    } catch (error) {
      toast.error("Failed to update like");
    } finally {
      setLoading(false);
    }
  }

  async function handleReport() {
    if (!session) {
      toast.error("Please sign in to report threads");
      return;
    }

    try {
      await fetch(`/api/community/threads/${threadId}/report`, {
        method: "POST"
      });
      toast.success("Thread reported to moderators");
    } catch (error) {
      toast.error("Failed to report thread");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={loading}
        className={liked ? "text-red-500" : ""}
      >
        <Heart className={`w-4 h-4 mr-2 ${liked ? "fill-current" : ""}`} />
        {count}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: "Share Thread",
              url: window.location.href
            });
          } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard");
          }
        }}
      >
        <Share2 className="w-4 h-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleReport}>
            <Flag className="w-4 h-4 mr-2" />
            Report
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bookmark className="w-4 h-4 mr-2" />
            Save
          </DropdownMenuItem>
          {onDelete && (
            <DropdownMenuItem
              className="text-red-500"
              onClick={onDelete}
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}