"use client"

import { IconToolsKitchen2, IconShieldLock } from "@tabler/icons-react";
import { LoginForm } from "@/features/auth/components/login-form";
import { useTheme } from "@/lib/theme/use-theme";
import { BackgroundDecorations } from "./components/background-decorations";


export default function LoginPage() {

  const { theme } = useTheme()

  return (
    <main className="min-h-screen bg-ui-bg-soft flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundDecorations />

      <div className="w-full max-w-md relative z-10">

        <div className="text-center mb-8">
          <div
            className="inline-flex h-20 w-20 items-center justify-center
                       rounded-2xl bg-brand shadow-lg shadow-brand/20
                       mb-4 ring-1 ring-white/10 dark:ring-white/5
                       transition-all duration-300 hover:shadow-brand/30"
          >
            <IconToolsKitchen2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-ui-text">منوی دیجیتال</h1>
          <p className="mt-1 text-sm text-ui-text-soft">پنل مدیریت مجموعه</p>
        </div>

        <div
          className="rounded-2xl border border-ui-border bg-ui-surface
                     p-8 shadow-lg shadow-ui-border/20
                     dark:shadow-black/20
                     transition-all duration-300"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 rounded-lg bg-brand-light dark:bg-brand/20">
              <IconShieldLock className="h-5 w-5 text-brand dark:text-brand-light" />
            </div>
            <h2 className="text-lg font-semibold text-ui-text">
              ورود به حساب کاربری
            </h2>
          </div>

          <LoginForm />
        </div>

        <p className="text-center mt-6 text-xs text-ui-text-muted">
          در صورت فراموشی رمز عبور با پشتیبانی تماس بگیرید
        </p>
      </div>
    </main>
  );
}

