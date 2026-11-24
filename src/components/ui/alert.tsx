import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert, Info } from "lucide-react";
import type { ComponentProps } from "react";

const alertVariants = cva(
  "grid grid-cols-[auto_1fr] items-start gap-x-2.5 gap-y-1 rounded-md border px-4 py-3 text-sm [&>svg]:size-[1.125rem] [&>svg]:translate-y-px",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-foreground [&>svg]:text-primary",
        destructive:
          "border-destructive bg-destructive-soft text-foreground [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const icons = {
  default: Info,
  destructive: CircleAlert,
};

const Alert = ({
  className,
  variant,
  children,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof alertVariants>) => {
  const Icon = icons[variant ?? "default"];

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon aria-hidden="true" />
      {children}
    </div>
  );
};

const AlertTitle = ({ className, ...props }: ComponentProps<"p">) => {
  return (
    <p
      data-slot="alert-title"
      className={cn("col-start-2 font-semibold", className)}
      {...props}
    />
  );
};

const AlertDescription = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-3 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};

export { Alert, AlertDescription, AlertTitle };
