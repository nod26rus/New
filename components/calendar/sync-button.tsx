"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

interface SyncButtonProps {
  type: "habit" | "note";
  id: string;
}

export function SyncButton({ type, id }: SyncButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleSync() {
    setLoading(true);
    try {
      const response = await fetch("/api/calendar/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && data.authUrl) {
          // Redirect to Google OAuth if not connected
          window.location.href = data.authUrl;
          return;
        }
        throw new Error(data.error);
      }

      toast.success("Successfully synced with Google Calendar");
    } catch (error) {
      toast.error("Failed to sync with calendar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSync}
      disabled={loading}
    >
      <Calendar className="w-4 h-4 mr-2" />
      {loading ? "Syncing..." : "Sync to Calendar"}
    </Button>
  );
}