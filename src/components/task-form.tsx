"use client";

import { taskCreateInputSchema } from "@/schemas/task";
import type { TaskRouterInputs } from "@/trpc/react";
import type { SubmitEvent } from "react";
import { useState } from "react";
import { z } from "zod";

interface TaskFormValues {
  titulo: string;
  descricao: string;
}

interface TaskFormProps {
  initialValues?: TaskFormValues;
  onSubmit: (values: TaskRouterInputs["create"]) => void;
  isSubmitting: boolean;
  serverError?: Error | null;
}

const defaultValues: TaskFormValues = {
  titulo: "",
  descricao: "",
};

export const TaskForm = (props: TaskFormProps) => {
  const { initialValues, isSubmitting, onSubmit, serverError } = props;
  const [values, setValues] = useState<TaskFormValues>(
    initialValues ?? defaultValues,
  );
  const [errors, setErrors] = useState<{
    titulo?: string[];
    descricao?: string[];
  }>({});

  const onFormSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = taskCreateInputSchema.safeParse(values);

    if (!result.success) {
      const resultErrors = z.flattenError(result.error).fieldErrors;

      setErrors(resultErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  };

  return (
    <form onSubmit={onFormSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="titulo"
          value={values.titulo}
          onChange={(e) => setValues({ ...values, titulo: e.target.value })}
          aria-invalid={Boolean(errors.titulo)}
          aria-describedby={errors.titulo ? "title-error" : undefined}
        />
        {errors.titulo && <p id="title-error">{errors.titulo[0]}</p>}
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          name="descricao"
          id="description"
          value={values.descricao}
          onChange={(e) => setValues({ ...values, descricao: e.target.value })}
          aria-invalid={Boolean(errors.descricao)}
          aria-describedby={errors.descricao ? "description-error" : undefined}
        />
        {errors.descricao && (
          <p id="description-error">{errors.descricao[0]}</p>
        )}
      </div>

      {serverError?.message && <p role="alert">{serverError.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {initialValues ? "Update" : "Create"} task
      </button>
    </form>
  );
};
