import "server-only";

type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: number;
};

const collection: Map<string, Task> = new Map();

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

export { type Task, list, get, create, update, remove };
