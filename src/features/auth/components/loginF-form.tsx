'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useState } from 'react'

import { loginSchema, type LoginFormValues } from '../schemas'
import { useLogin } from '../hooks/use-login'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { isLoading, serverError, login, clearError } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: LoginFormValues) => {
    login(values)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onChange={clearError}
      className="space-y-5"
      noValidate
    >
      {serverError && (
        <div
          role="alert"
          className={cn(
            'flex items-start gap-3 rounded-xl border border-red-200',
            'bg-red-50 px-4 py-3 text-sm text-red-700',
            'animate-in fade-in slide-in-from-top-1 duration-300'
          )}
        >
          <IconAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <span>{serverError}</span>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">ایمیل</Label>
        <div className="relative">
          <IconMail
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4',
              errors.email ? 'text-red-400' : 'text-gray-400'
            )}
          />
          <Input
            id="email"
            type="email"
            placeholder="example@gmail.com"
            autoComplete="email"
            error={!!errors.email}
            className="pr-10 text-left placeholder:text-right"
            dir="ltr"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p
            role="alert"
            className="flex items-center gap-1.5 text-xs text-red-600
                       animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <IconAlertCircle className="h-3 w-3" />
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">رمز عبور</Label>
        <div className="relative">
          <IconLock
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4',
              errors.password ? 'text-red-400' : 'text-gray-400'
            )}
          />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="حداقل ۶ کاراکتر"
            autoComplete="current-password"
            error={!!errors.password}
            className="pr-10 pl-10"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2',
              'text-gray-400 hover:text-gray-600 transition-colors',
              'focus:outline-none'
            )}
            aria-label={showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'}
          >
            {showPassword
              ? <IconEyeOff className="h-4 w-4" />
              : <IconEye className="h-4 w-4" />
            }
          </button>
        </div>
        {errors.password && (
          <p
            role="alert"
            className="flex items-center gap-1.5 text-xs text-red-600
                       animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <IconAlertCircle className="h-3 w-3" />
            {errors.password.message}
          </p>
        )}
      </div>


      <Button
        type="submit"
        variant="outline"
        size="lg"
        loading={isLoading}
        className="w-full mt-2 text-black/70 cursor-pointer"
      >
        {isLoading ? 'در حال ورود...' : 'ورود به پنل مدیریت'}
      </Button>
    </form>
  )
}