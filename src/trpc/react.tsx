"use client";

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import { makeQueryClient } from "./query-client";
import type { AppRouter } from "@/server/api/root";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
export type TaskRouterOutputs = inferRouterOutputs<AppRouter>["task"];
export type TaskRouterInputs = inferRouterInputs<AppRouter>["task"];

// Defining browserQueryClient at module level lets us reuse the client,
// avoiding creating a new one when the first render suspends.
let browserQueryClient: QueryClient;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
};

export const TRPCReactProvider = (
  props: Readonly<{
    children: React.ReactNode;
  }>,
) => {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
};
