import { TaskList } from "@/components/task-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { connection } from "next/server";

// Blocks the page until the list is ready instead of streaming it with Suspense,
// so the tasks are in the HTML even without JavaScript.
export const instant = false;

export default async function Home() {
  // The store is synchronous, so without this Next would prerender the page
  // at build time with an empty list. Everything after it runs at request time.
  await connection();

  const queryClient = getQueryClient();
  // If it fails on the server, the client fetches the list again.
  await queryClient
    .infiniteQuery(
      trpc.task.list.infiniteQueryOptions(
        {},
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
      ),
    )
    .catch(() => {});

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TaskList />
      </HydrationBoundary>
    </div>
  );
}
