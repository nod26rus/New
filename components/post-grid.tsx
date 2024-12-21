"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PostCard } from "./post-card";
import { PostListAd } from "./ads/post-list-ad";
import { Post, PostsResponse } from "@/lib/types/post";

interface PostGridProps {
  searchQuery?: string;
  limit?: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function PostGrid({ searchQuery = "", limit = 6 }: PostGridProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [adInterval, setAdInterval] = useState<number>(0);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/settings/ads');
        if (response.ok) {
          const data = await response.json();
          setAdInterval(data.postListAdInterval || 0);
        }
      } catch (error) {
        console.error('Failed to load ad settings:', error);
      }
    }

    loadSettings();
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchQuery,
          limit: limit.toString()
        });

        const response = await fetch(`/api/posts?${params}`);
        if (!response.ok) throw new Error("Failed to fetch posts");
        
        const data: PostsResponse = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [searchQuery, limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="aspect-[16/10] bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <h2 className="text-2xl font-semibold mb-2">No posts found</h2>
        <p className="text-muted-foreground">
          Try adjusting your search parameters
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {posts.map((post, index) => (
        <>
          <PostCard key={post.id} post={post} />
          {adInterval > 0 && (index + 1) % adInterval === 0 && (
            <PostListAd key={`ad-${index}`} className="col-span-full" />
          )}
        </>
      ))}
    </motion.div>
  );
}