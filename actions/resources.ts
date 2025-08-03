// lib/actions/dashboard.ts
"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getDashboardData() {
  const { userId } = await auth();

  // Fetch recent resources
  const recentResources = await prisma.resource.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          first_name: true,
          id: true,
          clerkId: true,
        },
      },
    },
  });

  return {
    clerkId: userId,
    recentResources: recentResources.map((resource) => ({
      id: resource.id,
      title: resource.title,
      type: resource.document_type,
      category: resource.category,
      description: resource.description,
      resourceLink: resource.resourceLink,
      userName: resource.user.first_name,
      clerkId: resource.user.clerkId,
      createdAt: resource.createdAt.toISOString(),
    })),
  };
}
