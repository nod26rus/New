"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { PartnerStats } from "@/lib/types/referral";

interface PartnerStatsProps {
  stats: PartnerStats[];
}

export function PartnerStats({ stats }: PartnerStatsProps) {
  const [metric, setMetric] = useState<'clicks' | 'signups' | 'revenue'>('clicks');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Partner Performance
            <div className="flex gap-2">
              <Button
                variant={metric === 'clicks' ? 'default' : 'outline'}
                onClick={() => setMetric('clicks')}
                size="sm"
              >
                Clicks
              </Button>
              <Button
                variant={metric === 'signups' ? 'default' : 'outline'}
                onClick={() => setMetric('signups')}
                size="sm"
              >
                Signups
              </Button>
              <Button
                variant={metric === 'revenue' ? 'default' : 'outline'}
                onClick={() => setMetric('revenue')}
                size="sm"
              >
                Revenue
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), "MMM d")}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => format(new Date(date), "PPP")}
                  formatter={(value) => [
                    metric === 'revenue' ? `$${value}` : value,
                    metric.charAt(0).toUpperCase() + metric.slice(1)
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey={metric}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}