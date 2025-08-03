// lib/actions/dashboard.ts
"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getDashboardData() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Fetch user data
  const userData = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      events: {
        orderBy: { createdAt: "desc" },
      },
      projects: {
        orderBy: { createdAt: "desc" },
      },
      resources: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  // Fetch upcoming events
//   const upcomingEvents = await prisma.event.findMany({
//     where: {
//       time: {
//         gte: new Date(),
//       },
//     },
//     orderBy: {
//       time: "asc",
//     },
//     take: 5,
//     include: {
//       host: {
//         select: {
//           first_name: true,
//           id: true,
//         },
//       },
//     },
//   });

  // Fetch recent resources
  const recentResources = await prisma.resource.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
    include: {
      user: {
        select: {
          first_name: true,
        },
      },
    },
  });

  return {
    user: {
      id: userData.id,
      first_name: userData.first_name,
      email: userData.email,
      eventsCount: userData.events.length,
      projectsCount: userData.projects.length,
      resourcesCount: userData.resources.length,
    },
    // upcomingEvents: upcomingEvents.map((event) => ({
    //   id: event.id,
    //   title: event.title,
    //   time: event.time.toISOString(),
    //   type: event.type,
    //   location: event.location,
    //   hostName: event.host.first_name,
    // })),
    recentResources: recentResources.map((resource) => ({
      id: resource.id,
      title: resource.title,
      type: resource.document_type,
      userName: resource.user.first_name,
      createdAt: resource.createdAt.toISOString(),
    })),
  };
}

export async function getUserStats(userId: string) {
  const stats = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      _count: {
        select: {
          events: true,
          projects: true,
          resources: true,
        },
      },
    },
  });

  return stats?._count || { events: 0, projects: 0, resources: 0 };
}
