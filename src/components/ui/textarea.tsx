import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[100px] w-full rounded-xl border px-4 py-3",
        "text-sm resize-none",
        "bg-ui-surface text-ui-text",
        "placeholder:text-ui-text-muted",
        "border-ui-border",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-brand",
        "focus:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-red-400 focus:ring-red-400",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
