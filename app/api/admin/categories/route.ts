import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";
import { CategoryUpdate } from "@/lib/types/category";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      where: { isActive: true }
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.role === 'admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updates: CategoryUpdate[] = await request.json();
    
    const updatePromises = updates.map(update => 
      prisma.category.update({
        where: { id: update.id },
        data: {
          name: update.name,
          order: update.order,
          isActive: update.isActive
        }
      })
    );

    await prisma.$transaction(updatePromises);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.role === 'admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, slug } = await request.json();
    
    const lastCategory = await prisma.category.findFirst({
      orderBy: { order: 'desc' }
    });
    
    const newOrder = (lastCategory?.order ?? 0) + 1;
    
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        order: newOrder,
        isActive: true
      }
    });
    
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}