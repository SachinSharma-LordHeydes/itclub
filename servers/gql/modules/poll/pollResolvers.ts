import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "../../auth/auth";
import { GraphQLContext } from "../../context";

export const pollResolvers = {
  Query: {
    getPoll: async (_: any, { id }: { id: string }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return prisma.poll.findUnique({
        where: { id },
        include: {
          options: {
            include: { votes: true },
          },
          votes: true,
        },
      });
    },

    getPolls: async (_: any, __: any, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return prisma.poll.findMany({
        include: {
          options: true,
        },
      });
    },
  },

  Mutation: {
    createPoll: async (
      _: any,
      {
        title,
        description,
        options,
        expiresAt,
      }: {
        title: string;
        description: string;
        options: string[];
        expiresAt: string;
      },
      ctx: GraphQLContext
    ) => {
      const user = requireAuth(ctx);

      return prisma.poll.create({
        data: {
          title,
          description,
          adminId: user.id,
          status: "OPEN",
          expiresAt: new Date(expiresAt),
          options: {
            create: options.map((optionText) => ({
              text: optionText,
            })),
          },
        },
        include: {
          options: true,
        },
      });
    },

    votePoll: async (
      _: any,
      {
        pollId,
        optionId,
      }: {
        pollId: string;
        optionId: string;
      },
      ctx: GraphQLContext
    ) => {
      const user = requireAuth(ctx);

      const alreadyVoted = await prisma.vote.findFirst({
        where: {
          pollId,
          userId: user.id,
        },
      });

      if (alreadyVoted) {
        throw new Error("You have already voted in this poll.");
      }

      return prisma.vote.create({
        data: {
          pollId,
          userId: user.id,
          optionId,
        },
        include: {
          option: true,
          poll: {
            include: {
              options: true,
            },
          },
          user: true,
        },
      });
    },

    updatePoll: async (
      _: any,
      {
        id,
        title,
        description,
        status,
        expiresAt,
        options,
      }: {
        id: string;
        title?: string;
        description?: string;
        status?: "OPEN" | "CLOSE";
        expiresAt?: string;
        options?: string[];
      },
      ctx: GraphQLContext
    ) => {
      requireAuth(ctx);

      return prisma.$transaction(async (tx) => {
        if (options) {
          await tx.vote.deleteMany({
            where: {
              pollId: id,
            },
          });
        }

        return tx.poll.update({
          where: { id },
          data: {
            title,
            description,
            status,
            expiresAt: expiresAt ? new Date(expiresAt) : undefined,
            options: options
              ? {
                  deleteMany: {},
                  create: options.map((optionText) => ({
                    text: optionText,
                  })),
                }
              : undefined,
          },
          include: { options: true },
        });
      });
    },

    deletePoll: async (_: any, { id }: { id: string }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return prisma.poll.delete({
        where: { id },
      });
    },
  },
};
