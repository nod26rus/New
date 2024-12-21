import { prisma } from '@/lib/prisma';

export async function checkAchievements(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      habits: true,
      achievements: {
        include: { achievement: true }
      }
    }
  });

  if (!user) return;

  const achievements = await prisma.achievement.findMany();
  const newAchievements: string[] = [];

  for (const achievement of achievements) {
    // Skip if already earned
    if (user.achievements.some(ua => ua.achievementId === achievement.id)) {
      continue;
    }

    const criteria = achievement.criteria as any;
    let earned = false;

    // Check different criteria types
    switch (criteria.type) {
      case 'STREAK':
        earned = user.habits.some(h => h.streakCount >= criteria.days);
        break;
      case 'LEVEL':
        earned = user.level >= criteria.level;
        break;
      case 'POINTS':
        earned = user.points >= criteria.points;
        break;
    }

    if (earned) {
      await prisma.userAchievement.create({
        data: {
          userId: user.id,
          achievementId: achievement.id
        }
      });
      newAchievements.push(achievement.name);
    }
  }

  return newAchievements;
}