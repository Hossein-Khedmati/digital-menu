'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconLogout } from '@tabler/icons-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      loading={isLoading}
      onClick={handleLogout}
      className="text-red-600 hover:text-red-600 hover:bg-red-100 cursor-pointer"
    >
      <IconLogout className="h-4 w-4" />
      <span>خروج</span>
    </Button>
  )
}