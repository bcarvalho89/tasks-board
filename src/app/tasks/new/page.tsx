import { CreateTaskForm } from "@/components/create-task-form";
import Link from "next/link";

export default function NewTask() {
  return (
    <div>
      <h1>Create new task</h1>
      <Link href="/">Back to tasks</Link>
      <CreateTaskForm />
    </div>
  );
}
