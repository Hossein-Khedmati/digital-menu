import type { ReactNode } from 'react'
import { createClient }   from '@/lib/supabase/server'
import { buildBrandCssVars } from '@/lib/theme/brand-color'
import { redirect }       from 'next/navigation'

export default async function AdminDashboardLayout({
  children
}: {
  children: ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data } = await supabase
    .from('restaurants')
    .select('brand_color')
    .eq('owner_id', user.id)
    .single()

  const brandCss = buildBrandCssVars(data?.brand_color ?? '#9333ea')

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `:root { ${brandCss} }`
      }} />
      {children}
    </>
  )
}