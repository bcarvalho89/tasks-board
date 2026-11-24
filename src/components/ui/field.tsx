"use client";

import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext, useId } from "react";

interface FieldContextValue {
  id: string;
  errorId: string;
  invalid: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

// Wires the label, the control and the error message by id, so the
// accessible name and description can't drift apart.
const useFieldControl = (props: ComponentProps<"input" | "textarea">) => {
  const field = useContext(FieldContext);

  return {
    id: props.id ?? field?.id,
    "aria-invalid": props["aria-invalid"] ?? (field?.invalid || undefined),
    "aria-describedby":
      props["aria-describedby"] ?? (field?.invalid ? field.errorId : undefined),
  };
};

const controlClassName =
  "w-full rounded-md border border-input bg-card px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive motion-reduce:transition-none";

const Input = ({ className, ...props }: ComponentProps<"input">) => {
  const control = useFieldControl(props);

  return (
    <input
      data-slot="input"
      className={cn(controlClassName, "h-11", className)}
      {...props}
      {...control}
    />
  );
};

const Textarea = ({ className, ...props }: ComponentProps<"textarea">) => {
  const control = useFieldControl(props);

  return (
    <textarea
      data-slot="textarea"
      className={cn(controlClassName, "min-h-24 resize-y", className)}
      {...props}
      {...control}
    />
  );
};

interface FieldProps {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

const Field = ({ label, error, className, children }: FieldProps) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <FieldContext value={{ id, errorId, invalid: Boolean(error) }}>
      <div data-slot="field" className={cn("grid gap-1.5", className)}>
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        {children}
        {error && (
          <p
            id={errorId}
            className="flex items-center gap-1.5 text-sm text-destructive"
          >
            <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    </FieldContext>
  );
};

export { Field, Input, Textarea };
