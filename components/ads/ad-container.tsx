"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdSettings {
  adHtmlCode: string;
  adEnabled: boolean;
}

export function AdContainer() {
  const [settings, setSettings] = useState<AdSettings>({
    adHtmlCode: "",
    adEnabled: false
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadAdSettings() {
      try {
        const response = await fetch('/api/settings/ads');
        if (!response.ok) throw new Error();
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Failed to load ad settings:', error);
        setError(true);
      }
    }

    loadAdSettings();
  }, []);

  if (error || !settings.adEnabled || !settings.adHtmlCode) {
    return null;
  }

  return (
    <div className="my-8 text-center">
      <div 
        dangerouslySetInnerHTML={{ __html: settings.adHtmlCode }}
        className="inline-block"
      />
    </div>
  );
}