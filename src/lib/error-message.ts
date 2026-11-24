import { TRPCClientError } from "@trpc/client";

export const getErrorMessage = (error: unknown) => {
  if (error instanceof TRPCClientError) {
    if (!error.data) {
      return "Couldn't reach the server. Check your connection.";
    }

    // Only these messages are written by us; the others may be technical.
    if (error.data.httpStatus === 403 || error.data.httpStatus === 404) {
      return error.message;
    }
  }

  return "Something went wrong. Please try again.";
};
