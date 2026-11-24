"use client";

import { useTRPC } from "@/trpc/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TaskItem } from "./task-item";
import Link from "next/link";
import { useEffect, useRef } from "react";

export const TaskList = () => {
  const trpc = useTRPC();
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);

  const {
    data,
    isPending,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    trpc.task.list.infiniteQueryOptions(
      {},
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      },
    ),
  );

  useEffect(() => {
    if (!loadMoreButtonRef.current) {
      return;
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    intersectionObserver.observe(loadMoreButtonRef.current);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

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

  const tasks = data.pages.flatMap((page) => {
    return page.items;
  });

  const renderTasks = () => {
    if (tasks.length === 0) return <p>No tasks found</p>;

    return (
      <>
        <ul>
          {tasks.map((task) => (
            <TaskItem key={task.id} {...task} />
          ))}
        </ul>

        {hasNextPage && (
          <button
            ref={loadMoreButtonRef}
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading more tasks" : "Load more tasks"}
          </button>
        )}
      </>
    );
  };

  return (
    <>
      <Link href="/tasks/new">Add task</Link>

      {renderTasks()}
    </>
  );
};
