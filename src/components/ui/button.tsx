import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'rounded-xl font-medium text-sm',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-brand focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-60',
    'active:scale-[0.98] cursor-pointer',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-brand text-white shadow-md',
          'hover:bg-brand-dark hover:shadow-lg',
        ].join(' '),

        outline: [
          'border-2 border-brand text-brand bg-transparent',
          'hover:bg-brand-subtle',
        ].join(' '),

        ghost: [
          'text-ui-text-soft bg-transparent',
          'hover:bg-ui-bg-muted hover:text-ui-text',
        ].join(' '),

        destructive: [
          'bg-red-500 text-white shadow-md',
          'hover:bg-red-600',
        ].join(' '),
      },
      size: {
        sm:      'h-8  px-3 text-xs',
        default: 'h-11 px-5 text-sm',
        lg:      'h-13 px-8 text-base',
        icon:    'h-10 w-10 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
)
Button.displayName = 'Button'

export { Button, buttonVariants }