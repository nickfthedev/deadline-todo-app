import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const timerRouter = createTRPCRouter({
  createTimer: protectedProcedure
    .input(z.object({ 
      title: z.string().min(1), 
      description: z.string(), 
      date: z.date(),
      tagId: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timer.create({
        data: {
          title: input.title,
          description: input.description,
          date: input.date,
          user: { connect: { id: ctx.session.user.id } },
          tag: input.tagId ? { connect: { id: input.tagId } } : undefined,
        },
      });
    }),
  editTimer: protectedProcedure
    .input(z.object({ 
      id: z.string(), 
      title: z.string().min(1), 
      description: z.string(), 
      date: z.date(),
      tagId: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timer.update({
        where: { id: input.id, user: { id: ctx.session.user.id } },
        data: { 
          title: input.title, 
          description: input.description, 
          date: input.date,
          tag: input.tagId ? { connect: { id: input.tagId } } : { disconnect: true },
        },
      });
    }),
  deleteTimer: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timer.delete({ where: { id: input.id, user: { id: ctx.session.user.id } } });
    }),
  markAsDone: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timer.update({ where: { id: input.id, user: { id: ctx.session.user.id } }, data: { done: true } });
    }),
  markAsUndone: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timer.update({ where: { id: input.id, user: { id: ctx.session.user.id } }, data: { done: false } });
    }),
  getTimerByTimerID: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.timer.findFirst({
        where: { id: input.id, user: { id: ctx.session.user.id } },
      });
    }),
  getAllTimersByUserID: protectedProcedure
    .input(z.object({ 
      showDone: z.boolean(),
      tagId: z.string().optional()
    }))
    .query(({ ctx, input }) => {
      return ctx.db.timer.findMany({
        where: { 
          user: { id: ctx.session.user.id }, 
          done: input.showDone === true ? true : false,
          ...(input.tagId && { tagId: input.tagId })
        },
        orderBy:
          input.showDone ?
            {
              updatedAt: "desc"
            }
            :
            { date: "asc" },
        include: {
          tag: true
        }
      });
    }),
});
