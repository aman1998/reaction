"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type RemoveQueueItemDialogProps = {
  fileName: string;
  disabled?: boolean;
  onConfirm: () => void;
};

export function RemoveQueueItemDialog({
  fileName,
  disabled,
  onConfirm,
}: RemoveQueueItemDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        disabled={disabled}
        render={
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            aria-label={`Remove ${fileName}`}
            className="shrink-0"
          />
        }
      >
        <Trash2 />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove icon?</AlertDialogTitle>
          <AlertDialogDescription>
            &quot;{fileName}&quot; will be removed from the queue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
