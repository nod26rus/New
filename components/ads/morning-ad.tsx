"use client";

import { useEffect, useState } from "react";

interface AdSettings {
  adHtmlCode: string;
  adEnabled: boolean;
}

export function MorningAd() {
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
      className="my-8 text-center"
      dangerouslySetInnerHTML={{ __html: settings.adHtmlCode }}
    />
  );
}