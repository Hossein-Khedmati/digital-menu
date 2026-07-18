import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('restaurants')
    .select('count')
  console.log(data);
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          منوی دیجیتال
        </h1>
        {error ? (
          <p className="text-red-500">خطا در اتصال: {error.message}</p>
        ) : (
          <p className="text-green-500 font-medium">
            ✅ اتصال به دیتابیس برقرار است
          </p>
        )}
      </div>
    </main>
  )
}