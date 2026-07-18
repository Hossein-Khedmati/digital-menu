import type { Metadata } from "next";
import { IconToolsKitchen2, IconShieldLock } from "@tabler/icons-react";
import { LoginForm } from "@/features/auth/components/loginF-form";

export const metadata: Metadata = {
  title: "ورود به پنل مدیریت",
  description: "ورود به پنل مدیریت منوی دیجیتال",
};

export default function LoginPage() {
  return (
    <main
      className="min-h-screen bg-linear-to-br
                 from-brand-50 via-white to-purple-50
                 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="inline-flex h-16 w-16 items-center justify-center
                       rounded-2xl bg-brand-600 shadow-lg shadow-brand-200
                       mb-4 border border-black"
          >
            <IconToolsKitchen2 className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">منوی دیجیتال</h1>
          <p className="mt-1 text-sm text-gray-500">پنل مدیریت رستوران</p>
        </div>

        <div
          className="rounded-2xl border border-gray-200 bg-white
                     p-8 shadow-xl shadow-gray-200"
        >
          <div className="flex items-center gap-2 mb-6">
            <IconShieldLock className="h-5 w-5 text-brand-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              ورود به حساب کاربری
            </h2>
          </div>

          <LoginForm />
        </div>

        <p className="text-center mt-6 text-xs text-gray-400">
          در صورت فراموشی رمز عبور با پشتیبانی تماس بگیرید
        </p>
      </div>

      <BackgroundDecoration />
    </main>
  );
}

function BackgroundDecoration() {
  return (
    <>
      <div
        aria-hidden="true"
        className="fixed -top-40 -right-40 h-80 w-80 rounded-full
                   bg-brand-100 opacity-50 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="fixed -bottom-40 -left-40 h-80 w-80 rounded-full
                   bg-purple-100 opacity-50 blur-3xl pointer-events-none"
      />
    </>
  );
}
