"use client";

import { Button } from "@/components/ui/button";

interface ProgressFiltersProps {
  period: "week" | "month";
  onPeriodChange: (period: "week" | "month") => void;
}

export function ProgressFilters({ period, onPeriodChange }: ProgressFiltersProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={period === "week" ? "default" : "outline"}
        onClick={() => onPeriodChange("week")}
      >
        Week
      </Button>
      <Button
        variant={period === "month" ? "default" : "outline"}
        onClick={() => onPeriodChange("month")}
      >
        Month
      </Button>
    </div>
  );
}