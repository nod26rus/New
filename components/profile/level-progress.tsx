"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { calculateLevel, pointsToNextLevel } from "@/lib/gamification/points";

interface LevelProgressProps {
  points: number;
}

export function LevelProgress({ points }: LevelProgressProps) {
  const level = calculateLevel(points);
  const nextLevelPoints = pointsToNextLevel(points);
  const progress = nextLevelPoints > 0 
    ? ((points % 100) / nextLevelPoints) * 100
    : 100;

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h3 className="text-2xl font-bold">Level {level}</h3>
          <p className="text-sm text-muted-foreground">
            {nextLevelPoints > 0
              ? `${nextLevelPoints} points to next level`
              : "Max level reached!"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold">{points}</p>
          <p className="text-sm text-muted-foreground">Total Points</p>
        </div>
      </motion.div>

      <Progress value={progress} className="h-2" />
    </div>
  );
}