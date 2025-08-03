import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "../../auth/auth";
import { GraphQLContext } from "../../context";

export const resourceResolvers = {
  Query: {
    getResource: async (
      _: any,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      requireAuth(ctx);
      return prisma.resource.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });
    },
    getResources: async (_: any, args: any, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return prisma.resource.findMany({
        include: {
          user: true,
        },
        take: args.limit,
        skip: args.offset,
        orderBy: {
          createdAt: "desc", 
        },
      });
    },
  },
  Mutation: {
    createResource: async (_: any, args: any, ctx: GraphQLContext) => {
      const user = requireAuth(ctx);

      return prisma.resource.create({
        data: {
          userId: user.id,
          title: args.title,
          description: args.description,
          category: args.category,
          document_type: args.document_type,
          resourceLink: args.resourceLink,
        },
        include: {
          user: true,
        },
      });
    },
    updateResource: async (_: any, args: any, ctx: GraphQLContext) => {
      const user = requireAuth(ctx);
      const { id, ...data } = args;

      const resource = await prisma.resource.findUnique({
        where: { id: args.id },
      });

      if (!resource || resource.userId !== user.id) {
        throw new Error("Unauthorized");
      }

      return prisma.resource.update({
        where: {
          id,
        },
        data,
        include: {
          user: true,
        },
      });
    },
    deleteResource: async (_: any, args: any, ctx: GraphQLContext) => {
      const user = requireAuth(ctx);

      const resource = await prisma.resource.findUnique({
        where: { id: args.id },
      });
      if (!resource || resource.userId !== user.id) {
        throw new Error("Unauthorized");
      }
      await prisma.resource.delete({
        where: { id: args.id },
      });
      return true;
    },
  },
};
