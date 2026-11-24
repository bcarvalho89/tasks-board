"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

export const TaskList = () => {
  const trpc = useTRPC();

  const { data, isPending } = useQuery(trpc.task.list.queryOptions());

  if (isPending) {
    return <p>Loading</p>;
  }

  if (data?.length === 0) return <p>No tasks found</p>;

  return (
    <ul>
      {data?.map((task) => (
        <li key={task.id}>{task.titulo}</li>
      ))}
    </ul>
  );
};
