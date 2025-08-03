import { prisma } from '@/lib/db/prisma';
import { auth } from '@clerk/nextjs/server';

export interface GraphQLContext {
  prisma: typeof prisma;
  user?: {
    id: string;
    clerkId: string;
    email: string;
    role: string;
  } | null;
}

export async function createContext(request: Request): Promise<GraphQLContext> {
  try {
    const { userId } = await auth();
    
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: {
          id: true,
          clerkId: true,
          email: true,
          role: true,
        },
      });
    }

    return {
      prisma,
      user,
    };
  } catch (error) {
    console.error('Error creating GraphQL context:', error);
    return {
      prisma,
      user: null,
    };
  }
}