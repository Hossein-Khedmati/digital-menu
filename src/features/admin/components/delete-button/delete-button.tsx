"use client";

import { useState, useTransition } from "react";
import { IconLoader2, IconTrash, IconAlertTriangle } from "@tabler/icons-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Props } from "./types";

export function DeleteBtn({
  action,
  onDeleted,
  title = "حذف آیتم",
  description = "آیا مطمئن هستید؟ این عمل قابل بازگشت نیست.",
}: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await action();
      if (result.success) {
        toast.success("با موفقیت حذف شد");
        setOpen(false);
        onDeleted();
      } else {
        toast.error(result.error ?? "خطا در حذف");
      }
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="size-8 p-0"
        onClick={() => setOpen(true)}
      >
        <IconTrash size={16} stroke={2} />
      </Button>

      <Dialog open={open} onOpenChange={(v) => !isPending && setOpen(v)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center
                             rounded-full bg-red-100 shrink-0"
              >
                <IconAlertTriangle
                  size={18}
                  stroke={2}
                  className="text-red-600"
                />
              </span>
              {title}
            </DialogTitle>
          </DialogHeader>

          <DialogBody>
            <p className="text-sm text-ui-text-muted">{description}</p>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              انصراف
            </Button>
            <Button
              type="button"
              variant="destructive"
              loading={isPending}
              onClick={handleConfirm}
            >
              <IconTrash size={15} stroke={2} />
              {isPending ? "در حال حذف..." : "بله، حذف شود"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
