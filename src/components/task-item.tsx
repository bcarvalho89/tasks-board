import type { TaskRouterOutputs } from "@/trpc/react";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./toast";

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
          queryKey: trpc.task.list.queryKey(),
        });
      },
      onError: (error) => {
        show({
          message: error.message,
          type: "error",
        });
      },
    }),
  );

  return (
    <li>
      {titulo}
      <button onClick={() => remove({ id })} disabled={isPending}>
        Remove
      </button>
    </li>
  );
};
