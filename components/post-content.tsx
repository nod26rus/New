import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ className, ...props }) => (
            <h1 className={cn("text-3xl font-bold mt-8 mb-4", className)} {...props} />
          ),
          h2: ({ className, ...props }) => (
            <h2 className={cn("text-2xl font-bold mt-8 mb-4", className)} {...props} />
          ),
          p: ({ className, ...props }) => (
            <p className={cn("leading-7 mb-4", className)} {...props} />
          ),
          ul: ({ className, ...props }) => (
            <ul className={cn("list-disc list-inside mb-4", className)} {...props} />
          ),
          ol: ({ className, ...props }) => (
            <ol className={cn("list-decimal list-inside mb-4", className)} {...props} />
          ),
          blockquote: ({ className, ...props }) => (
            <blockquote 
              className={cn(
                "border-l-4 border-muted pl-4 italic my-4",
                className
              )} 
              {...props} 
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}