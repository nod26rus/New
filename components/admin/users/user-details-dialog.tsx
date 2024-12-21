"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Entry {
  id: string;
  content: string;
  type: string;
  createdAt: string;
}

interface UserDetailsDialogProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({
  userId,
  open,
  onOpenChange
}: UserDetailsDialogProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId && open) {
      fetchUserEntries();
    }
  }, [userId, open]);

  async function fetchUserEntries() {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/entries`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      toast.error("Failed to load user entries");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Entries</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-6">
              {entries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">
                      {entry.type}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(entry.createdAt), "PPP")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {entry.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}