import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "../../auth/auth";
import { GraphQLContext } from "../../context";

export const userResolvers = {
  Query: {
    getUser: async (_: any, __: any, ctx: GraphQLContext) => {
      const { clerkId } = ctx.user!;
      const userResponse = await prisma.user.findUnique({
        where: { clerkId },
        include: {
          events: true,
          projects: true,
          resources: true,
          polls: true,
          votes: true,
        },
      });

      console.log("user response-->", userResponse);
      return userResponse;
    },
    getUsers: async (
      _: any,
      { limit, offset }: { limit?: number; offset?: number },
      ctx: GraphQLContext
    ) => {
      const user = requireAuth(ctx);
      if(!user)throw new Error("login required") 
      const userResponse = await prisma.user.findMany({
        take: limit || 10,
        skip: offset || 0,
      });

      console.log(userResponse);
      return userResponse;
    },
  },
  Mutation: {
    updateUser: async (_: any, args: any, ctx: GraphQLContext) => {
      const { clerkId } = ctx.user!;
      return prisma.user.update({
        where: { clerkId },
        data: { ...args },
      });
    },
  },
};
