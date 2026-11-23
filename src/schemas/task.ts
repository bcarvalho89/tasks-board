import { z } from "zod";

const taskSchema = z.object({
  id: z.uuid(),
  titulo: z
    .string()
    .trim()
    .min(1, "The title is required.")
    .max(100, "The title must be at most 100 characters."),
  descricao: z
    .string()
    .trim()
    .max(500, "The description must be at most 500 characters.")
    .nullish()
    .transform((value) => {
      return value === "" ? null : value;
    }),
  dataCriacao: z.number(),
});

const taskCreateInputSchema = taskSchema.pick({
  titulo: true,
  descricao: true,
});

// If the description is missing, it is left unchanged.
// If the description is null, empty string "" or only spaces, it is cleared.
// If the description is a valid text, it is replaced.
const taskUpdateInputSchema = taskSchema.omit({ dataCriacao: true });

const taskIdInputSchema = taskSchema.pick({ id: true });

type Task = z.infer<typeof taskSchema>;

export {
  taskCreateInputSchema,
  taskUpdateInputSchema,
  taskIdInputSchema,
  type Task,
};
