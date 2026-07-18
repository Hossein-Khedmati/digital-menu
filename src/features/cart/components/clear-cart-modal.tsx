"use client";

import { useState } from "react";
import { IconAlertTriangle, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";

type Props = {
  onConfirm: () => void;
};

export function ClearCartDialog({ onConfirm }: Props) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-center text-xs py-1
                   text-ui-text-muted hover:text-red-500
                   transition-colors"
      >
        پاک کردن سبد
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center
                             rounded-full bg-red-100 dark:bg-red-500/10 shrink-0"
              >
                <IconAlertTriangle
                  size={18}
                  stroke={2}
                  className="text-red-600 dark:text-red-400"
                />
              </span>
              پاک کردن سبد سفارش
            </DialogTitle>
          </DialogHeader>

          <DialogBody>
            <p className="text-sm text-ui-text-muted">
              تمام آیتم‌های سبد سفارش حذف می‌شوند. این عمل قابل بازگشت نیست.
            </p>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              انصراف
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirm}>
              <IconTrash size={15} stroke={2} />
              بله، پاک شود
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
