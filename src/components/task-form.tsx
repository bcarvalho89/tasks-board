"use client";

import { taskCreateInputSchema } from "@/schemas/task";
import type { TaskRouterInputs } from "@/trpc/react";
import type { SubmitEvent } from "react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "./ui/button";
import { Field, Input, Textarea } from "./ui/field";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface TaskFormValues {
  titulo: string;
  descricao: string;
}

interface TaskFormProps {
  initialValues?: TaskFormValues;
  onSubmit: (values: TaskRouterInputs["create"]) => void;
  isSubmitting: boolean;
  serverError?: string;
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

      const firstInvalid = e.currentTarget.elements.namedItem(
        Object.keys(resultErrors)[0],
      );

      if (firstInvalid instanceof HTMLElement) {
        firstInvalid.focus();
      }

      return;
    }

    setErrors({});
    onSubmit(result.data);
  };

  return (
    <form
      onSubmit={onFormSubmit}
      className="grid gap-5 rounded-md border border-border bg-card p-4 sm:p-6"
    >
      <Field label="Title" error={errors.titulo?.[0]}>
        <Input
          name="titulo"
          value={values.titulo}
          onChange={(e) => setValues({ ...values, titulo: e.target.value })}
        />
      </Field>

      <Field label="Description" error={errors.descricao?.[0]}>
        <Textarea
          name="descricao"
          value={values.descricao}
          onChange={(e) => setValues({ ...values, descricao: e.target.value })}
        />
      </Field>

      {serverError && (
        <Alert variant="destructive">
          <AlertTitle>Couldn&apos;t save the task</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="justify-self-start"
        isLoading={isSubmitting}
      >
        {initialValues ? "Update" : "Create"} task
      </Button>
    </form>
  );
};
