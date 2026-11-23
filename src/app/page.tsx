"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const trpc = useTRPC();

  const { data, isPending } = useQuery(trpc.task.list.queryOptions());

  const renderTasks = () => {
    if (data?.length === 0) return <p>No tasks found</p>;

    return (
      <ul>
        {data?.map((task) => (
          <li key={task.id}>{task.titulo}</li>
        ))}
      </ul>
    );
  };

  return <div>{isPending ? <p>Loading</p> : renderTasks()}</div>;
}
