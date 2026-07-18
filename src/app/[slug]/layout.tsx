import type { ReactNode }     from 'react'
import { createClient }       from '@/lib/supabase/server'
import { buildBrandCssVars }  from '@/lib/theme/brand-color'

type Props = {
  children: ReactNode
  params:   Promise<{ slug: string }>
}

export default async function RestaurantLayout({ children, params }: Props) {
  const { slug } = await params
  const supabase  = await createClient()

  const { data } = await supabase
    .from('restaurants')
    .select('brand_color')
    .eq('slug', slug)
    .eq('is_active', true)
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