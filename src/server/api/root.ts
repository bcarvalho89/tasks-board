import "server-only";

import { taskRouter } from "@/server/api/routers/task";
import { router } from "@/server/api/trpc";

export const appRouter = router({
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
