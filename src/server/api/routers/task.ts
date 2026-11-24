import "server-only";
import { create, get, list, remove, update } from "@/server/store/tasks";
import { publicProcedure, router } from "@/server/api/trpc";
import {
  taskCreateInputSchema,
  taskIdInputSchema,
  taskListInputSchema,
  taskUpdateInputSchema,
} from "@/schemas/task";
import { TRPCError } from "@trpc/server";

export const taskRouter = router({
  list: publicProcedure.input(taskListInputSchema).query(({ input }) => {
    return list(input);
  }),

  create: publicProcedure.input(taskCreateInputSchema).mutation(({ input }) => {
    const payload = input;

    return create(payload);
  }),

  update: publicProcedure.input(taskUpdateInputSchema).mutation(({ input }) => {
    const { id, ...payload } = input;
    const updatedTask = update(id, payload);

    if (updatedTask) {
      return updatedTask;
    }

    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Task ${id} not found.`,
    });
  }),

  get: publicProcedure.input(taskIdInputSchema).query(({ input }) => {
    const { id } = input;
    const task = get(id);

    if (task) {
      return task;
    }

    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Task ${id} not found.`,
    });
  }),

  remove: publicProcedure.input(taskIdInputSchema).mutation(({ input }) => {
    const { id } = input;
    const task = remove(id);

    if (task) {
      return task;
    }

    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Task ${id} not found.`,
    });
  }),
});
