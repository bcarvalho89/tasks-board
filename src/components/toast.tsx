"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import type { PropsWithChildren } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type ToastType = "success" | "error";

const durations: Record<ToastType, number> = {
  success: 3000,
  error: 6000,
};

interface Toast {
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  show: (toast: Toast) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ToastProvider = ({ children }: PropsWithChildren) => {
  const timerId = useRef<ReturnType<typeof setTimeout>>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const clearTimer = useCallback(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
  }, []);

  const show = useCallback(
    (toast: Toast) => {
      clearTimer();
      setToast(toast);

      timerId.current = setTimeout(() => {
        setToast(null);
      }, durations[toast.type]);
    },
    [clearTimer],
  );

  const dismiss = () => {
    clearTimer();
    setToast(null);
  };

  useEffect(() => clearTimer, [clearTimer]);

  const Icon = toast?.type === "error" ? CircleAlert : CircleCheck;

  return (
    <ToastContext value={{ show }}>
      {children}

      <div role="status" className="sr-only">
        {toast?.type === "success" && toast.message}
      </div>
      <div role="alert" className="sr-only">
        {toast?.type === "error" && toast.message}
      </div>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:justify-end">
          <div
            data-slot="toast"
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-md border border-l-4 border-border bg-card py-1 pr-1 pl-4 text-sm text-card-foreground shadow-lg",
              toast.type === "error"
                ? "border-l-destructive"
                : "border-l-success",
            )}
          >
            <Icon
              className={cn(
                "size-4.5 shrink-0",
                toast.type === "error" ? "text-destructive" : "text-success",
              )}
              aria-hidden="true"
            />
            <p className="flex-1 py-2">{toast.message}</p>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Dismiss notification"
              onClick={dismiss}
            >
              <X />
            </Button>
          </div>
        </div>
      )}
    </ToastContext>
  );
};

const useToast = () => {
  const value = useContext(ToastContext);

  if (!value) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return value;
};

export { ToastProvider, useToast };
