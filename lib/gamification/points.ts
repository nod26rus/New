export const POINTS = {
  MORNING_RITUAL: 10,
  EVENING_RITUAL: 10,
  HABIT_COMPLETE: 5,
  STREAK_MILESTONE: 20,
} as const;

export const LEVEL_THRESHOLDS = [
  0,    // Level 1
  100,  // Level 2
  250,  // Level 3
  500,  // Level 4
  1000, // Level 5
];

export function calculateLevel(points: number): number {
  return LEVEL_THRESHOLDS.findIndex(threshold => points < threshold) || LEVEL_THRESHOLDS.length;
}

export function pointsToNextLevel(points: number): number {
  const currentLevel = calculateLevel(points);
  const nextThreshold = LEVEL_THRESHOLDS[currentLevel];
  return nextThreshold ? nextThreshold - points : 0;
}