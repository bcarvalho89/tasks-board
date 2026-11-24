# Task Board

A small task manager: list, create, edit and remove tasks. The backend keeps tasks in memory and exposes them through tRPC. The task list is server-side rendered and loads more tasks as you scroll.

**Demo:** https://brunocarvalho.me/demos/task-board

## Stack

- [Next.js 16](https://nextjs.org) (App Router) with React 19
- [tRPC 11](https://trpc.io) with [TanStack Query 5](https://tanstack.com/query)
- [Zod 4](https://zod.dev) for input validation
- [Tailwind CSS 4](https://tailwindcss.com), [Lucide](https://lucide.dev) icons and [next-themes](https://github.com/pacocoursey/next-themes)
- TypeScript, ESLint, Prettier

## Running

Requirements: Node.js 20.9+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. In development the store starts with 80 fake tasks, so there is something to scroll through. A production build starts empty:

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

## How it works

```text
Browser ──> page (Server Component) ──> tRPC caller ──> router ──> in-memory store
   │                                                      ▲
   └──> Client Components ──> tRPC client + React Query ──┴── HTTP /api/trpc
```

Next.js is both the frontend and the backend. The tRPC router in `src/server` validates every input with Zod and reads or writes an in-memory `Map`. The browser reaches it over HTTP through a route handler (`/api/trpc`). Server Components call the same router directly, without HTTP.

On the list page, the server fetches the first page of tasks, puts it in the React Query cache and sends that cache along with the HTML (prefetch and hydrate). The tasks are in the HTML even without JavaScript, and the browser doesn't fetch them again. After that, React Query owns the data: mutations invalidate the list, and the next pages load as the user scrolls.

The client only imports the `AppRouter` type (`import type`), so the types are shared end to end and no server code reaches the browser.

## Decisions

- **Next.js 16.** The case mentions Next.js 15, but the setup requirement asks for the latest versions, so I used 16 with the App Router.
- **Field names.** `titulo`, `descricao` and `dataCriacao` keep the names from the case, so the requirements are easy to match. Everything else is in English.
- **`dataCriacao` is a number** (`Date.now()`, milliseconds). A `Date` doesn't survive JSON without a transformer such as superjson, and a number needs no extra dependency.
- **Ids are `crypto.randomUUID()`.** They are unique without shared state. A counter would restart at 1 with the server and could repeat ids a client still holds.
- **Prefetch and hydrate for SSR**, instead of rendering the data directly on the server. The client gets the same cache the server filled, so it doesn't fetch the list twice.
- **The store lives in `globalThis`.** In a production build, the route handler and the page load separate copies of the store module, and each would get its own `Map`. `globalThis` gives them one.
- **Form state with `useState`**, without a form library. The case asks for functional components and hooks, and the form has two fields. The same Zod schema validates on the client and on the server.
- **Cursor pagination, not offset.** An offset ("skip 20") shifts when tasks are added or removed while scrolling, so pages repeat or skip items. The cursor is the id of the last task of the page.
- **Newest tasks first**, so a new task shows at the top, next to the toast that confirms it.
- **Retries:** queries retry up to 3 times in the browser, but never on 4xx errors (the answer won't change) and never on the server.
- **Error messages:** only the `NOT_FOUND` message from the server reaches the user. Network errors and unexpected errors get a generic message, so no internal detail leaks.
- **No component library.** The UI primitives (`Button`, `Field`, `Alert`, `ConfirmDialog`, `Skeleton`) are built on native elements with Tailwind. The confirmation uses the native `<dialog>`, which already traps focus and closes on Escape.
- **Accessibility:** text contrast of at least 4.5:1 in both themes, 44px touch targets, visible keyboard focus, labelled fields with errors linked by `aria-describedby`, focus moved to the first invalid field, live regions for feedback and `prefers-reduced-motion` respected.

## Limitations

- **Data lives in the memory of one process.** It is lost on every restart, and two server instances would each have their own tasks.
- **Concurrent edits:** the last write wins. There is no version check.
- **A removed cursor:** if another tab removes the task used as the cursor before the next page loads, the list restarts from the top. In a single tab, invalidating the list recalculates the cursors.
- **No authentication:** every visitor sees and changes the same tasks.

## With more time

- Tests: unit tests for the store and the schemas, and an end-to-end test of the create, edit and remove flow.
- A database (for example PostgreSQL with Drizzle or Prisma), with an index on the creation date for the pagination.
- Optimistic updates for removing and editing, so the list changes before the server answers.
- Opening a task in a modal with its own URL (Next.js intercepting routes), like a board.
- Authentication and tasks per user.
- A monorepo only if a second app, such as a mobile one, needs the same router.

## How this was built

I wrote the case logic myself: the tRPC setup on both sides, the schemas, the store, the CRUD with its errors, the server-side rendering, the form and its validation, the loading and error states, and the infinite scroll. I used an AI assistant (Claude) as a reviewer along the way, and to set up the boilerplate and the UI layer: the primitives in `src/components/ui`, the styling, the theme toggle and the confirmation dialog, built on the same pattern I use in another project of mine. This README was drafted with it and reviewed by me.

## Project structure

```text
src/
├── app/
│   ├── api/trpc/[trpc]/route.ts  # HTTP entry point for tRPC
│   ├── layout.tsx                # Header, theme and the tRPC/React Query providers
│   ├── page.tsx                  # Task list (server-side rendered)
│   └── tasks/
│       ├── new/page.tsx          # Create a task
│       └── [id]/                 # Edit a task, and its not-found page
├── components/                   # Client components (list, form, toast, theme)
│   └── ui/                       # UI primitives
├── lib/                          # Helpers (class names, error messages)
├── schemas/task.ts               # Zod schemas shared by server and client
├── server/
│   ├── api/                      # tRPC init, routers and the AppRouter type
│   └── store/tasks.ts            # In-memory task store
└── trpc/                         # tRPC clients for Client and Server Components
```
