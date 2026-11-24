"use client";

import { useTRPC } from "@/trpc/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TaskItem } from "./task-item";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button, buttonVariants } from "./ui/button";
import { ListTodo, Plus } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

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

  const renderContent = () => {
    if (isPending) {
      return (
        <>
          <p role="status" className="sr-only">
            Loading tasks
          </p>
          <ul className="grid gap-2" aria-hidden="true">
            {Array.from({ length: 3 }, (_, index) => (
              <li
                key={index}
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-card py-1 pr-1 pl-4"
              >
                <div className="grid flex-1 gap-2 py-2">
                  <Skeleton className="h-4 w-2/5" />
                  <Skeleton className="h-3.5 w-3/5" />
                </div>
                <Skeleton className="m-3 size-5" />
              </li>
            ))}
          </ul>
        </>
      );
    }

    if (!data) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Couldn&apos;t load the tasks</AlertTitle>
          <AlertDescription>
            Check your connection and try again.
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    const tasks = data.pages.flatMap((page) => {
      return page.items;
    });

    if (tasks.length === 0) {
      return (
        <div className="grid justify-items-center gap-2 rounded-md border border-dashed border-border px-4 py-12 text-center">
          <ListTodo
            className="size-8 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="font-semibold">No tasks yet</p>
          <p className="text-sm text-muted-foreground">
            Add your first task to get started.
          </p>
        </div>
      );
    }

    return (
      <>
        <ul className="grid gap-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} {...task} />
          ))}
        </ul>

        {hasNextPage && (
          <Button
            ref={loadMoreButtonRef}
            variant="outline"
            className="self-center"
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            Load more tasks
          </Button>
        )}
      </>
    );
  };

  return (
    <section className="flex flex-col gap-4" aria-labelledby="tasks-heading">
      <div className="flex items-center justify-between gap-4">
        <h1 id="tasks-heading" className="text-2xl font-bold">
          Tasks
        </h1>
        <Link href="/tasks/new" className={buttonVariants()}>
          <Plus aria-hidden="true" />
          Add task
        </Link>
      </div>

      {renderContent()}
    </section>
  );
};
