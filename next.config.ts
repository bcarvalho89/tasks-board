import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Set when the app is served under a subpath, like the public demo.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
