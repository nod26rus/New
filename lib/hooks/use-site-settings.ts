import { useEffect, useState } from 'react';
import { SiteSettings } from '@/lib/types/settings';

const defaultSettings: SiteSettings = {
  siteName: 'Modern AI Blog',
  bannerImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
  funnelText: 'Discover the future of content creation',
  logo: '/logo.png'
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  return { settings, loading };
}