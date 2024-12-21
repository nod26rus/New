import { Configuration, OpenAIApi } from 'openai';
import { buildMorningPrompt } from './prompt-builder';
import { prisma } from '@/lib/prisma';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function generateMorningRecommendation(userId: string) {
  try {
    const prompt = await buildMorningPrompt(userId);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a supportive AI assistant that provides personalized morning recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const recommendation = completion.data.choices[0].message?.content;

    if (recommendation) {
      await prisma.recommendation.create({
        data: {
          userId,
          content: recommendation,
          type: 'MORNING'
        }
      });
    }

    return recommendation;
  } catch (error) {
    console.error('Failed to generate recommendation:', error);
    throw error;
  }
}