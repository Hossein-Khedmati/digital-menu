'use client'

import { useState, useMemo, useCallback } from 'react'

type Searchable = { name: string; [key: string]: unknown }

export function useSearch<T extends Searchable>(items: T[]) {
  const [query, setQuery] = useState('')

  const [debouncedQuery, setDebouncedQuery] = useState('')

  const handleSetQuery = useCallback((value: string) => {
    setQuery(value)

    if (!value.trim()) {
      setDebouncedQuery('')
      return
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(value)
    }, 150)

    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (!q) return items

    return items.filter((item) =>
      item.name.toLowerCase().includes(q) ||
      (typeof item.description === 'string' &&
        item.description.toLowerCase().includes(q))
    )
  }, [items, debouncedQuery])

  return {
    query,    
    debouncedQuery, 
    setQuery: handleSetQuery,
    filtered,
    hasQuery: debouncedQuery.trim().length > 0,
  }
}