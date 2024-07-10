import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const tagsRouter = createTRPCRouter({
  createTag: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const baseHandle = input.name.toLowerCase().replace(/\s/g, "-");
      let handle = baseHandle;
      let count = 1;

      // Check for existing tags with the same handle
      while (await ctx.db.tags.findFirst({
        where: { handle, user: { id: ctx.session.user.id } },
      })) {
        handle = `${baseHandle}-${count}`;
        count++;
      }

      return ctx.db.tags.create({
        data: {
          name: input.name,
          handle,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  editTag: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const baseHandle = input.name.toLowerCase().replace(/\s/g, "-");
      let handle = baseHandle;
      let count = 1;

      // Check for existing tags with the same handle
      while (await ctx.db.tags.findFirst({
        where: { handle, user: { id: ctx.session.user.id } },
      })) {
        handle = `${baseHandle}-${count}`;
        count++;
      }

      return ctx.db.tags.update({
        where: { id: input.id, user: { id: ctx.session.user.id } },
        data: { name: input.name, handle },
      });
    }),
  deleteTag: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timer.delete({ where: { id: input.id, user: { id: ctx.session.user.id } } });
    }),
  getTagByTagID: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.tags.findFirst({
        where: { id: input.id, user: { id: ctx.session.user.id } },
      });
    }),
  getAllTagsByUserID: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.tags.findMany({
        where: { user: { id: ctx.session.user.id } },
        orderBy: {
          name: "asc"
        }
      });
    }),
});