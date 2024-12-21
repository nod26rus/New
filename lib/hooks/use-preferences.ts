import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';

const GUEST_ID_KEY = 'guest_id';

export function usePreferences() {
  const { data: session } = useSession();
  const [guestId, setGuestId] = useState<string>('');

  useEffect(() => {
    if (!session) {
      let id = localStorage.getItem(GUEST_ID_KEY);
      if (!id) {
        id = uuidv4();
        localStorage.setItem(GUEST_ID_KEY, id);
      }
      setGuestId(id);
    }
  }, [session]);

  async function trackCategoryView(categoryId: string) {
    try {
      await fetch('/api/preferences/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId,
          guestId: session ? undefined : guestId
        }),
      });
    } catch (error) {
      console.error('Failed to track category view:', error);
    }
  }

  return { trackCategoryView };
}