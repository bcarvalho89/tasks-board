"use client";

import { useTRPC } from "@/trpc/react";
import { useToast } from "./toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { TaskForm } from "./task-form";
import { getErrorMessage } from "@/lib/error-message";

export const EditTaskForm = ({ id }: { id: string }) => {
  const { show } = useToast();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: task } = useQuery(trpc.task.get.queryOptions({ id }));

  const {
    mutate: update,
    isPending,
    error,
    data,
  } = useMutation(
    trpc.task.update.mutationOptions({
      onSuccess: (updatedTask) => {
        show({
          message: `The task "${updatedTask.titulo}" was updated.`,
          type: "success",
        });

        router.push("/");

        return Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.task.list.pathKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.task.get.pathKey(),
          }),
        ]);
      },
    }),
  );

  return (
    <TaskForm
      key={data?.id}
      initialValues={{
        descricao: task?.descricao ?? "",
        titulo: task?.titulo ?? "",
      }}
      isSubmitting={isPending}
      onSubmit={(values) => {
        update({
          ...values,
          id,
        });
      }}
      serverError={error ? getErrorMessage(error) : undefined}
    />
  );
};
