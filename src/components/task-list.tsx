"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { TaskItem } from "./task-item";
import Link from "next/link";

export const TaskList = () => {
  const trpc = useTRPC();

  const { data, isPending, refetch } = useQuery(trpc.task.list.queryOptions());

  if (isPending) {
    return <p>Loading</p>;
  }

  if (!data) {
    return (
      <>
        <p role="alert">Couldn&apos;t load the tasks.</p>
        <button onClick={() => refetch()}>Try again</button>
      </>
    );
  }

  const renderTasks = () => {
    if (data.length === 0) return <p>No tasks found</p>;

    return (
      <ul>
        {data.map((task) => (
          <TaskItem key={task.id} {...task} />
        ))}
      </ul>
    );
  };

  return (
    <>
      <Link href="/tasks/new">Add task</Link>

      {renderTasks()}
    </>
  );
};
