import type { Task } from "@/schemas/task";
import "server-only";

// The route handler and the page load separate copies of this module, so the
// collection lives in globalThis to share one Map. It also survives hot reload.
const globalForCollection = globalThis as unknown as {
  collection: Map<string, Task> | undefined;
};

const collection = globalForCollection.collection ?? new Map<string, Task>();

globalForCollection.collection = collection;

const list = () => {
  const tasks = collection.values();

  return [...tasks];
};

const get = (id: string) => {
  const task = collection.get(id);

  if (task) {
    return task;
  }

  return null;
};

const create = (payload: Pick<Task, "descricao" | "titulo">) => {
  const id = crypto.randomUUID();
  const creationDate = Date.now();
  const task: Task = {
    ...payload,
    id,
    dataCriacao: creationDate,
  };

  collection.set(id, task);
  return task;
};

const update = (id: string, payload: Pick<Task, "descricao" | "titulo">) => {
  const task = collection.get(id);

  if (task) {
    const updatedTask: Task = {
      ...task,
      ...payload,
    };
    collection.set(id, updatedTask);

    return updatedTask;
  }

  return null;
};

const remove = (id: string) => {
  const task = collection.get(id);

  if (task) {
    collection.delete(id);

    return task;
  }

  return null;
};

if (process.env.NODE_ENV === "development" && collection.size === 0) {
  for (let i = 0; i < 80; i++) {
    create({
      titulo: `Task ${i + 1}`,
      descricao: null,
    });
  }
}

export { type Task, list, get, create, update, remove };
