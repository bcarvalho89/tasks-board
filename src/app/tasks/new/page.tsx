import { CreateTaskForm } from "@/components/create-task-form";
import { BackLink } from "@/components/back-link";

export default function NewTask() {
  return (
    <div className="grid gap-4">
      <BackLink className="justify-self-start" />
      <h1 className="text-2xl font-bold">Create new task</h1>
      <CreateTaskForm />
    </div>
  );
}
