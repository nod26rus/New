import { useEffect } from 'react';

export function usePostView(postId: string) {
  useEffect(() => {
    async function recordView() {
      try {
        await fetch(`/api/posts/${postId}/view`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Failed to record post view:', error);
      }
    }

    recordView();
  }, [postId]);
}