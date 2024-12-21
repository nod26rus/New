import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Создаем администратора
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: adminPassword,
      role: 'admin',
    },
  })

  // Создаем базовые настройки
  const settings = [
    {
      key: 'site_name',
      value: 'Modern AI Blog',
      type: 'string',
      category: 'site',
    },
    {
      key: 'site_description',
      value: 'Исследуйте мир через призму искусственного интеллекта',
      type: 'string',
      category: 'site',
    },
    {
      key: 'gpt_daily_limit',
      value: '100',
      type: 'number',
      category: 'limits',
    },
    {
      key: 'dalle_daily_limit',
      value: '50',
      type: 'number',
      category: 'limits',
    },
    {
      key: 'base_article_prompt',
      value: 'Напиши информативную и увлекательную статью на тему: ',
      type: 'string',
      category: 'site',
    },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    })
  }

  console.log('База данных успешно заполнена начальными данными')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })