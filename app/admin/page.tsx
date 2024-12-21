"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, FileText, Hash, ImagePlus } from "lucide-react";
import Link from "next/link";

const adminCards = [
  {
    title: "Настройки",
    description: "Управление настройками сайта",
    icon: Settings,
    href: "/admin/settings"
  },
  {
    title: "Статьи",
    description: "Управление статьями",
    icon: FileText,
    href: "/admin/posts"
  },
  {
    title: "Категории",
    description: "Управление категориями",
    icon: Hash,
    href: "/admin/categories"
  },
  {
    title: "Медиа",
    description: "Управление изображениями",
    icon: ImagePlus,
    href: "/admin/media"
  }
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Панель управления</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card) => (
          <Card key={card.href}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <card.icon className="w-5 h-5" />
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {card.description}
              </p>
              <Button asChild>
                <Link href={card.href}>Перейти</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}