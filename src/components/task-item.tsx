import type { TaskRouterOutputs } from "@/trpc/react";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./toast";
import Link from "next/link";
import { getErrorMessage } from "@/lib/error-message";

export const TaskItem = (task: TaskRouterOutputs["get"]) => {
  const { id, titulo } = task;
  const { show } = useToast();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate: remove, isPending } = useMutation(
    trpc.task.remove.mutationOptions({
      onSuccess: () => {
        show({
          message: `The task "${titulo}" was removed.`,
          type: "success",
        });

        return queryClient.invalidateQueries({
          queryKey: trpc.task.list.pathKey(),
        });
      },
      onError: (error) => {
        show({
          message: getErrorMessage(error),
          type: "error",
        });
      },
    }),
  );

  return (
    <li>
      <Link href={`/tasks/${id}`}>{titulo}</Link>
      <button onClick={() => remove({ id })} disabled={isPending}>
        Remove
      </button>
    </li>
  );
};
