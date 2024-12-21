import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const achievements = await prisma.userAchievement.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        achievement: true
      },
      orderBy: {
        dateEarned: 'desc'
      }
    });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error("[ACHIEVEMENTS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}