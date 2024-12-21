import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role === "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const entries = await prisma.entry.findMany({
      where: {
        userId: params.id
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 50
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("[USER_ENTRIES_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch user entries" },
      { status: 500 }
    );
  }
}