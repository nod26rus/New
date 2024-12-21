"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  dateEarned: string;
}

interface AchievementsGridProps {
  achievements: Achievement[];
}

export function AchievementsGrid({ achievements }: AchievementsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((achievement) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                {achievement.iconUrl ? (
                  <img
                    src={achievement.iconUrl}
                    alt={achievement.name}
                    className="w-8 h-8"
                  />
                ) : (
                  <Trophy className="w-6 h-6 text-primary" />
                )}
              </div>
              <CardTitle className="text-lg">{achievement.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {achievement.description}
              </p>
              <p className="text-xs text-muted-foreground">
                Earned on {new Date(achievement.dateEarned).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}