"use client";

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

  const show = useCallback((toast: Toast) => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    setToast(toast);

    timerId.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, []);

  return (
    <ToastContext value={{ show }}>
      <div role="status">{toast?.message}</div>
      {children}
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
