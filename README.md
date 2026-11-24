# tasks-board

A simple task manager: list, create, edit and delete tasks. The backend keeps tasks in memory (no database) and exposes them through tRPC; the task list is server-side rendered.

> Work in progress.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) with React 19
- [tRPC 11](https://trpc.io) with [TanStack Query 5](https://tanstack.com/query)
- [Zod 4](https://zod.dev) for input validation
- [Tailwind CSS 4](https://tailwindcss.com)
- TypeScript, ESLint, Prettier

## Running

Requirements: Node.js 20.9+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

For a production build:

```bash
pnpm build
pnpm start
```

## Scripts

| Script              | What it does                         |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Starts the development server        |
| `pnpm build`        | Builds for production                |
| `pnpm start`        | Serves the production build          |
| `pnpm lint`         | Runs ESLint                          |
| `pnpm typecheck`    | Generates route types and runs `tsc` |
| `pnpm format`       | Formats the code with Prettier       |
| `pnpm format:check` | Checks formatting without writing    |

## Project structure

```text
src/
├── app/
│   ├── api/trpc/[trpc]/route.ts  # HTTP entry point for tRPC
│   ├── layout.tsx                # Root layout with the tRPC/React Query provider
│   └── page.tsx                  # Task list (server-side rendered)
├── components/                   # Client components
├── schemas/task.ts               # Zod schemas shared by server and client
├── server/
│   ├── api/                      # tRPC init, routers and the AppRouter type
│   └── store/tasks.ts            # In-memory task store
└── trpc/                         # tRPC clients for Client and Server Components
```
