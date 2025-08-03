import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "../../auth/auth";
import { GraphQLContext } from "../../context";

export const projectResolvers = {
  Query: {
    getProject: async (_: any, { id }: { id: string }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return prisma.project.findUnique({
        where: { id },
        include: {
          user: true,
          likedBy: true,
        },
      });
    },
    getProjects: async (_: any, __: any, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return prisma.project.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          likedBy: {
            include: {
              user: true,
            },
          },
        },
      });
    },
  },
  Mutation: {
    createProject: async (
      _: any,
      {
        title,
        description,
        tags,
        githubLink,
        liveLink,
      }: {
        title: string;
        description: string;
        tags: string[];
        githubLink: string;
        liveLink: string;
      },
      ctx: GraphQLContext
    ) => {
      const user = requireAuth(ctx);

      return prisma.project.create({
        data: {
          title,
          description,
          tags,
          githubLink,
          liveLink,
          user: {
            connect: { id: user.id },
          },
        },
        include: {
          user: true,
        },
      });
    },
    updateProject: async (
      _: any,
      {
        id,
        title,
        description,
        tags,
        githubLink,
        liveLink,
      }: {
        id: string;
        title: string;
        description: string;
        tags: string[];
        githubLink: string;
        liveLink: string;
      },
      ctx: GraphQLContext
    ) => {
      requireAuth(ctx);
      return prisma.project.update({
        where: { id },
        data: { title, description, tags, githubLink, liveLink },
      });
    },
    deleteProject: async (
      _: any,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      requireAuth(ctx);
      await prisma.project.delete({
        where: { id },
      });
      return true;
    },

    toggleProjectLikes: async (
      _: any,
      { projectId }: { projectId: string },
      ctx: GraphQLContext
    ) => {
      const user = requireAuth(ctx);
      const projects = await prisma.project.findUnique({
        where: {
          id: projectId,
        },
      });

      const existingLike = await prisma.like.findUnique({
        where: {
          userId_projectId: {
            userId: user.id,
            projectId: projectId,
          },
        },
      });

      if (!existingLike) {
        //create
        const likeRespone = await prisma.like.create({
          data: {
            userId: user.id,
            projectId: projectId,
          },
        });

        //increase count
        if (likeRespone) {
          // const likesCount=projects?.likes!+1
          await prisma.project.update({
            where: { id: projectId },
            data: {
              likes: projects?.likes! + 1,
            },
          });

          return { liked: true };
        }
      } else {
        //delete
        await prisma.like.delete({
          where: {
            userId_projectId: {
              userId: user.id,
              projectId: projectId,
            },
          },
        });

        //decrease
        await prisma.project.update({
          where: { id: projectId },
          data: {
            likes: projects!.likes - 1,
          },
        });

        return { liked: true };
      }
    },
  },
};
