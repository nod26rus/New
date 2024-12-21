"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ReferralCardProps {
  code: string;
  referralCount: number;
  pointsEarned: number;
}

export function ReferralCard({ code, referralCount, pointsEarned }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);
  const referralUrl = `${window.location.origin}/signup?ref=${code}`;

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  }

  async function shareReferral() {
    try {
      await navigator.share({
        title: 'Join me on Modern AI Blog',
        text: 'Use my referral code to get started!',
        url: referralUrl
      });
    } catch (error) {
      // User cancelled or share not supported
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input
              value={referralUrl}
              readOnly
              className="font-mono"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(referralUrl)}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={shareReferral}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{referralCount}</p>
              <p className="text-sm text-muted-foreground">Referrals</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{pointsEarned}</p>
              <p className="text-sm text-muted-foreground">Points Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}