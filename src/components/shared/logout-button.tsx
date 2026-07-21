'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconLogout } from '@tabler/icons-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog'

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-600 hover:bg-red-100 cursor-pointer"
        >
          <IconLogout className="h-4 w-4" />
          <span>خروج</span>
        </Button>
      </DialogTrigger>
      <DialogContent >
        <DialogHeader>
          <DialogTitle>خروج از حساب کاربری</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-ui-text-muted">
            آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟
          </p>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
          >
            انصراف
          </Button>
          <Button
            variant="destructive"
            loading={isLoading}
            onClick={handleLogout}
          >
            خروج
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}