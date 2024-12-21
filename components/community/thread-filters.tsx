"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Flame, ThumbsUp } from "lucide-react";

export function ThreadFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState(searchParams.get("sort") || "latest");

  function handleSortChange(value: string) {
    setSort(value);
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    router.push(`/community?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-2">
        <Button
          variant={sort === "latest" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSortChange("latest")}
        >
          <Clock className="w-4 h-4 mr-2" />
          Latest
        </Button>
        <Button
          variant={sort === "popular" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSortChange("popular")}
        >
          <Flame className="w-4 h-4 mr-2" />
          Popular
        </Button>
        <Button
          variant={sort === "most_liked" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSortChange("most_liked")}
        >
          <ThumbsUp className="w-4 h-4 mr-2" />
          Most Liked
        </Button>
      </div>

      <Select
        value={searchParams.get("category") || "all"}
        onValueChange={(value) => {
          const params = new URLSearchParams(searchParams);
          if (value === "all") {
            params.delete("category");
          } else {
            params.set("category", value);
          }
          router.push(`/community?${params.toString()}`);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="question">Questions</SelectItem>
          <SelectItem value="discussion">Discussions</SelectItem>
          <SelectItem value="showcase">Showcase</SelectItem>
          <SelectItem value="help">Help Wanted</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}