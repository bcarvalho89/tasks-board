import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>Task not found</h1>
      <p>It may have been removed.</p>
      <Link href="/">Back to tasks</Link>
    </div>
  );
}
