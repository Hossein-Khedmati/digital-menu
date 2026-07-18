import Link from "next/link";
import { IconToolsKitchen2, IconHome } from "@tabler/icons-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div
          className="inline-flex h-20 w-20 items-center justify-center
                        rounded-3xl border border-black mb-6"
        >
          <IconToolsKitchen2 className="size-10" color="black" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          رستوران یافت نشد !
        </h1>
        <p className="text-gray-400 mb-8">
          این آدرس وجود ندارد یا رستوران غیرفعال شده است .
        </p>
        <p className="text-gray-400 mb-8">
         اتصال اینترنت را بررسی کنید.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl
                     bg-ui-bg text-ui-text px-6 py-3
                     text-sm font-medium hover:bg-brand-700
                     transition-transform shadow-md shadow-brand-200 border border-black hover:scale-110 duration-200"
        >
          <IconHome className="h-4 w-4" />
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </main>
  );
}
