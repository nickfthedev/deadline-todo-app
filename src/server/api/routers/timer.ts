import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const timerRouter = createTRPCRouter({
  createTimer: protectedProcedure
    .input(z.object({ title: z.string().min(1), description: z.string(), date: z.date() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timer.create({
        data: {
          title: input.title,
          description: input.description,
          date: input.date,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getTimerByTimerID: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),
  getAllTimersByUserID: protectedProcedure.query(({ ctx }) => {
    return ctx.db.timer.findMany({
      where: { user: { id: ctx.session.user.id } },
      orderBy: { date: "asc" },
    });
  }),
});
