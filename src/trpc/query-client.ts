import { environmentManager, QueryClient } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";

export const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        retry: environmentManager.isServer()
          ? 0
          : (failureCount, error) => {
              if (isTRPCClientError(error)) {
                if (
                  error.data?.httpStatus >= 400 &&
                  error.data?.httpStatus < 500
                ) {
                  return false;
                }
              }

              return failureCount < 3;
            },
      },
    },
  });
};
