"use client";

import { useEffect, useState } from "react";

interface PostListAdProps {
  className?: string;
}

interface AdSettings {
  adHtmlCode: string;
  adEnabled: boolean;
  postListAdInterval: number;
}

export function PostListAd({ className }: PostListAdProps) {
  const [settings, setSettings] = useState<AdSettings | null>(null);

  useEffect(() => {
    async function loadAdSettings() {
      try {
        const response = await fetch('/api/settings/ads');
        if (!response.ok) throw new Error();
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Failed to load ad settings:', error);
      }
    }

    loadAdSettings();
  }, []);

  if (!settings?.adEnabled || !settings.adHtmlCode) {
    return null;
  }

  return (
    <div 
      className={`my-8 text-center ${className}`}
      dangerouslySetInnerHTML={{ __html: settings.adHtmlCode }}
    />
  );
}