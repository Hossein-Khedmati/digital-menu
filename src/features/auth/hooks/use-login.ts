'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { LoginFormValues } from '../schemas'

type LoginState = {
  isLoading: boolean
  serverError: string | null
}

export function useLogin() {
  const router = useRouter()
  const supabase = createClient()

  const [state, setState] = useState<LoginState>({
    isLoading: false,
    serverError: null,
  })

  const login = async (values: LoginFormValues) => {
    setState({ isLoading: true, serverError: null })

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        const persianError = mapAuthError(error.message)
        setState({ isLoading: false, serverError: persianError })
        return
      }

      router.push('/admin/dashboard')
      router.refresh()

    } catch {
      setState({
        isLoading: false,
        serverError: 'خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
      })
    }
  }

  const clearError = () =>
    setState((prev) => ({ ...prev, serverError: null }))

  return { ...state, login, clearError }
}

function mapAuthError(message: string): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials':
      'ایمیل یا رمز عبور اشتباه است.',
    'Email not confirmed':
      'ایمیل شما تأیید نشده است. لطفاً ایمیل خود را بررسی کنید.',
    'Too many requests':
      'تعداد تلاش‌های زیادی داشتید. چند دقیقه صبر کنید.',
    'User not found':
      'حساب کاربری با این ایمیل وجود ندارد.',
    'Network error':
      'خطا در اتصال به اینترنت. اتصال خود را بررسی کنید.',
  }

  for (const [key, value] of Object.entries(errorMap)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }

  return 'خطایی رخ داد. لطفاً دوباره تلاش کنید.'
}