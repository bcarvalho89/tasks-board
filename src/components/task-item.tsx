import type { TaskRouterOutputs } from "@/trpc/react";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./toast";
import Link from "next/link";
import { getErrorMessage } from "@/lib/error-message";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

export const TaskItem = (task: TaskRouterOutputs["get"]) => {
  const { id, titulo, descricao } = task;
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
    <li className="flex items-center justify-between gap-3 rounded-md border border-border bg-card py-1 pr-1 pl-4">
      <div className="grid min-w-0 py-2">
        <Link
          href={`/tasks/${id}`}
          className="truncate rounded-sm font-semibold underline-offset-4 outline-none hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          {titulo}
        </Link>
        {descricao && (
          <p className="truncate text-sm text-muted-foreground">{descricao}</p>
        )}
      </div>

      <Button
        variant="destructive"
        size="icon"
        isLoading={isPending}
        aria-label={`Remove ${titulo}`}
        onClick={() => remove({ id })}
      >
        <Trash2 />
      </Button>
    </li>
  );
};
