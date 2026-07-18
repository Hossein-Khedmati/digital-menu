'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useTransition, useState, useEffect } from 'react'
import { IconSearch, IconFilter, IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { SORT_OPTIONS } from './constants'

export function SearchAndSort() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentQ = searchParams.get('q') ?? ''
  const currentSort = searchParams.get('sort') ?? 'default'

  const [searchValue, setSearchValue] = useState(currentQ)

  useEffect(() => {
    setSearchValue(currentQ)
  }, [currentQ])

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      return params.toString()
    },
    [searchParams]
  )

  const handleSearch = (value: string) => {
    setSearchValue(value)
    startTransition(() => {
      const qs = createQueryString({ q: value })
      router.replace(`${pathname}?${qs}`, { scroll: false })
    })
  }

  const handleSort = (value: string) => {
    startTransition(() => {
      const qs = createQueryString({ sort: value === 'default' ? '' : value })
      router.replace(`${pathname}?${qs}`, { scroll: false })
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <IconSearch
          className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4',
            'transition-colors',
            isPending ? 'text-brand-500 animate-pulse' : 'text-gray-400'
          )}
        />
        <Input
          type="text"
          placeholder="جستجو در منو..."
          value={searchValue} // Changed from defaultValue to value
          onChange={(e) => handleSearch(e.target.value)}
          className="pr-10"
        />
        {/* Clear button - shows when there's text in the input */}
        {searchValue && ( // Changed from currentQ to searchValue
          <button
            onClick={() => handleSearch('')}
            className="absolute left-3 top-1/2 -translate-y-1/2
                       text-gray-300 hover:text-gray-500 transition-colors"
          >
            <IconX className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="relative shrink-0">
        <IconFilter
          className="absolute right-3 top-1/2 -translate-y-1/2
                     h-4 w-4 text-gray-400 pointer-events-none z-10"
        />
        <Select
          value={currentSort}
          onValueChange={handleSort}
          dir="rtl"
        >
          <SelectTrigger className="cursor-pointer pr-10">
            <SelectValue placeholder="مرتب‌سازی" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}