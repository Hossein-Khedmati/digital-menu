import Link from 'next/link'
import { UtensilsCrossed, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center
                        rounded-3xl bg-gray-100 mb-6">
          <UtensilsCrossed className="h-10 w-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          رستوران یافت نشد
        </h1>
        <p className="text-gray-400 mb-8">
          این آدرس وجود ندارد یا رستوران غیرفعال شده است.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl
                     bg-brand-600 text-white px-6 py-3
                     text-sm font-medium hover:bg-brand-700
                     transition-colors shadow-md shadow-brand-200"
        >
          <Home className="h-4 w-4" />
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </main>
  )
}