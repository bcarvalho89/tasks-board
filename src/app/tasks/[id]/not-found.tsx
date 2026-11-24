import { buttonVariants } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid justify-items-center gap-3 rounded-md border border-dashed border-border px-4 py-12 text-center">
      <SearchX className="size-8 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-2xl font-bold">Task not found</h1>
      <p className="text-muted-foreground">It may have been removed.</p>
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        Back to tasks
      </Link>
    </div>
  );
}
