import { prisma } from '@/lib/prisma'
import { getTodayDateStr } from './utils'

export async function incrementApiUsage(userId: string, type: 'gpt' | 'dalle') {
  const dateStr = getTodayDateStr()
  
  return prisma.apiUsage.upsert({
    where: {
      userId_type_dateStr: {
        userId,
        type,
        dateStr,
      },
    },
    update: {
      count: {
        increment: 1,
      },
    },
    create: {
      userId,
      type,
      dateStr,
      count: 1,
    },
  })
}

export async function checkApiLimit(userId: string, type: 'gpt' | 'dalle'): Promise<boolean> {
  const dateStr = getTodayDateStr()
  
  const usage = await prisma.apiUsage.findUnique({
    where: {
      userId_type_dateStr: {
        userId,
        type,
        dateStr,
      },
    },
  })

  const limit = await prisma.setting.findUnique({
    where: {
      key: `${type}_daily_limit`,
    },
  })

  if (!limit) return false

  const limitValue = parseInt(limit.value, 10)
  return !usage || usage.count < limitValue
}