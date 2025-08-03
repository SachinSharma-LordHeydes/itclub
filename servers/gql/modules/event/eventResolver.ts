import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "../../auth/auth";
import { GraphQLContext } from "../../context";



export const eventResolvers = {
  Query: {
    getEvent: async (_: any, { id }: { id: string }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      const event = await prisma.event.findUnique({
        where: { id },
        include: {
          host: true,
        },
      });

      return event
        ? {
            ...event,
            time: event.time.toISOString(),
            createdAt: event.createdAt.toISOString(),
          }
        : null;
    },

    getEvents: async (_: any, __: any, ctx: GraphQLContext) => {
      requireAuth(ctx);
      const events = await prisma.event.findMany({
        include: {
          host: true,
        },
      });

      // Return times as ISO strings for GraphQL
      return events.map((event) => ({
        ...event,
        time: event.time.toISOString(),
        createdAt: event.createdAt.toISOString(),
      }));
    },
  },

  Mutation: {
    createEvent: async (_: any, args: any, ctx: GraphQLContext) => {
      const user = requireAuth(ctx);

      const eventDateTime = new Date(args.datetime);

      if (isNaN(eventDateTime.getTime())) {
        throw new Error(
          "Invalid datetime value. Please provide a valid ISO datetime string."
        );
      }

      // Ensure the date is in the future
      if (eventDateTime <= new Date()) {
        throw new Error("Event time must be in the future.");
      }

      const event = await prisma.event.create({
        data: {
          title: args.title,
          description: args.description,
          type: args.type,
          location: args.location,
          day:"SUNDAY",
          time: eventDateTime,
          guest: args.guest || null,
          tags: args.tags || null,
          participant: args.participant || null,
          host: { connect: { id: user.id } },
        },
        include: {
          host: true,
        },
      });

      return {
        ...event,
        time: event.time.toISOString(),
        createdAt: event.createdAt.toISOString(),
      };
    },

    updateEvent: async (_: any, { id, ...args }: any, ctx: GraphQLContext) => {
      requireAuth(ctx);

      // Handle datetime update if provided
      const updateData: any = { ...args };
      if (args.datetime) {
        const eventDateTime = new Date(args.datetime);
        if (isNaN(eventDateTime.getTime())) {
          throw new Error(
            "Invalid datetime value. Please provide a valid ISO datetime string."
          );
        }
        updateData.time = eventDateTime;
        delete updateData.datetime;
      }

      const event = await prisma.event.update({
        where: { id },
        data: updateData,
        include: {
          host: true,
        },
      });

      return {
        ...event,
        time: event.time.toISOString(),
        createdAt: event.createdAt.toISOString(),
      };
    },

    deleteEvent: async (
      _: any,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      requireAuth(ctx);
      await prisma.event.delete({ where: { id } });
      return true;
    },
  },
};
