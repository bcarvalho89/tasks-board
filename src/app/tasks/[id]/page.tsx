import { EditTaskForm } from "@/components/edit-task-form";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { TRPCError } from "@trpc/server";
import { BackLink } from "@/components/back-link";
import { notFound } from "next/navigation";

export const instant = false;

export default async function EditTask(props: PageProps<"/tasks/[id]">) {
  const { id } = await props.params;

  const queryClient = getQueryClient();
  const task = await queryClient
    .query(trpc.task.get.queryOptions({ id }))
    .catch((e) => {
      if (e instanceof TRPCError) {
        // A malformed ID fails input validation (BAD_REQUEST),
        // but to the user it's still a missing task.
        if (e.code === "NOT_FOUND" || e.code === "BAD_REQUEST") {
          notFound();
        }
      }

      throw e;
    });

  return (
    <div className="grid gap-4">
      <BackLink className="justify-self-start" />
      <h1 className="text-2xl font-bold wrap-break-word">
        Edit &quot;{task.titulo}&quot;
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditTaskForm id={id} />
      </HydrationBoundary>
    </div>
  );
}
