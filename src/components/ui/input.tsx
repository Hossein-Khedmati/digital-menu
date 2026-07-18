import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border px-4 py-2",
        "text-sm",
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
Input.displayName = "Input";

export { Input };
