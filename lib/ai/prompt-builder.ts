import { prisma } from '@/lib/prisma';

interface UserContext {
  recentEntries: any[];
  healthData: any;
  preferences: any;
  previousRecommendations: any[];
}

export async function buildMorningPrompt(userId: string): Promise<string> {
  const context = await getUserContext(userId);
  
  const prompt = [
    "Generate a personalized morning message and recommendations.",
    "\nContext:",
    `- Stress level: ${context.healthData?.stressLevel || 'unknown'}`,
    `- Sleep quality: ${context.healthData?.sleepQuality || 'unknown'}`,
    `- Recent mood trend: ${getRecentMoodTrend(context.recentEntries)}`,
    "\nUser preferences:",
    ...getUserPreferencePrompts(context.preferences),
    "\nPrevious recommendations feedback:",
    ...getPreviousFeedbackPrompts(context.previousRecommendations),
    "\nGuidelines:",
    "- Keep the tone encouraging and supportive",
    "- Focus on achievable goals",
    "- Avoid repeating disliked suggestions",
    "- Include one actionable task",
    "- Keep response under 200 words"
  ].join("\n");

  return prompt;
}

async function getUserContext(userId: string): Promise<UserContext> {
  const [recentEntries, healthData, preferences, recommendations] = await Promise.all([
    prisma.entry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 7
    }),
    prisma.healthData.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.userPreference.findMany({
      where: { userId }
    }),
    prisma.recommendation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ]);

  return {
    recentEntries,
    healthData,
    preferences,
    previousRecommendations: recommendations
  };
}

function getRecentMoodTrend(entries: any[]): string {
  if (!entries.length) return 'unknown';
  
  const moodScores = entries.map(e => e.mood).filter(Boolean);
  if (moodScores.length < 2) return 'stable';

  const trend = moodScores[0] - moodScores[moodScores.length - 1];
  if (trend > 1) return 'improving';
  if (trend < -1) return 'declining';
  return 'stable';
}

function getUserPreferencePrompts(preferences: any[]): string[] {
  if (!preferences?.length) return ['No specific preferences recorded'];

  return preferences.map(pref => {
    if (pref.type === 'ACTIVITY') {
      return `- Prefers ${pref.value} activities`;
    }
    if (pref.type === 'FOCUS') {
      return `- Interested in ${pref.value}`;
    }
    return `- ${pref.type}: ${pref.value}`;
  });
}

function getPreviousFeedbackPrompts(recommendations: any[]): string[] {
  if (!recommendations?.length) return ['No previous recommendations'];

  const feedback = recommendations
    .filter(r => r.feedback)
    .map(r => `- ${r.feedback > 0 ? 'Liked' : 'Disliked'}: "${r.content}"`);

  return feedback.length ? feedback : ['No feedback on previous recommendations'];
}