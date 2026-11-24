"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "./button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Native <dialog> opened with showModal() gives the focus trap, Escape to close,
// the inert background and focus return to the trigger for free.
const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        // Escape is ignored while the action runs, like the buttons.
        event.preventDefault();

        if (!isLoading) {
          onCancel();
        }
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-lg border border-border bg-card p-6 text-card-foreground shadow-lg backdrop:bg-black/50"
    >
      <div className="grid gap-2">
        <h2 id={titleId} className="text-lg font-semibold">
          {title}
        </h2>
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {/* Cancel takes the initial focus, so an accidental Enter doesn't
            delete anything. */}
        <Button
          variant="outline"
          autoFocus
          disabled={isLoading}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="destructive-solid"
          isLoading={isLoading}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
};

export { ConfirmDialog };
