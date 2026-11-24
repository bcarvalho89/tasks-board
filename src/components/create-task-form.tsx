"use client";

import { useTRPC } from "@/trpc/react";
import { useToast } from "./toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { TaskForm } from "./task-form";
import { getErrorMessage } from "@/lib/error-message";

export const CreateTaskForm = () => {
  const { show } = useToast();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    mutate: create,
    isPending,
    error,
    data,
  } = useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: (task) => {
        show({
          message: `The task "${task.titulo}" was created.`,
          type: "success",
        });

        router.push("/");

        return queryClient.invalidateQueries({
          queryKey: trpc.task.list.pathKey(),
        });
      },
    }),
  );

  return (
    <TaskForm
      key={data?.id}
      isSubmitting={isPending}
      onSubmit={create}
      serverError={error ? getErrorMessage(error) : undefined}
    />
  );
};
