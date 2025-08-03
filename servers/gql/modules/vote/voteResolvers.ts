import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "../../auth/auth";
import { GraphQLContext } from "../../context";

export const voteResolvers = {
  Query: {},
  Mutation: {
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
  },
};
