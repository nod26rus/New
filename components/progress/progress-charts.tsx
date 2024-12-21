"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

interface ChartData {
  date: string;
  mood: number;
  habits: number;
}

interface ProgressChartsProps {
  period: "week" | "month";
}

export function ProgressCharts({ period }: ProgressChartsProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/progress?period=${period}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Failed to fetch progress data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [period]);

  if (loading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] bg-muted animate-pulse" />
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Mood Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), "MMM d")}
              />
              <YAxis domain={[0, 10]} />
              <Tooltip 
                labelFormatter={(date) => format(new Date(date), "PPP")}
                formatter={(value) => [`${value}/10`, "Mood"]}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Habits Completed</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), "MMM d")}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => format(new Date(date), "PPP")}
                formatter={(value) => [value, "Habits"]}
              />
              <Line 
                type="monotone" 
                dataKey="habits" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}