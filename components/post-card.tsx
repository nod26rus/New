"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from 'next-intl';
import { Post } from "@/lib/types/post";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const locale = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/post/${post.slug}`}>
        <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
          <motion.div 
            className="relative aspect-[16/10] overflow-hidden bg-muted"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={post.featuredImage}
              alt={post.title[locale]}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </motion.div>
          
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
              {post.title[locale]}
            </h2>
            <p className="text-muted-foreground line-clamp-2 mb-4">
              {post.excerpt[locale]}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="secondary" className="hover:bg-secondary/80">
                  #{tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>

          <CardFooter className="px-4 py-3 border-t flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author.name || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.createdAt).toLocaleDateString(locale)}</span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}