'use client'

import { useRef, useState }       from 'react'
import Image                      from 'next/image'
import {
  IconUpload,
  IconX,
  IconPhoto,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import toast  from 'react-hot-toast'

type Props = {
  value?:       string | null 
  onChange:     (file: File | null) => void
  onClear?:     () => void
  maxSizeMB?:   number
  accept?:      string
  aspectRatio?: 'square' | 'video' | 'free'
  className?:   string
  placeholder?: string
}

export function ImageUploader({
  value,
  onChange,
  onClear,
  maxSizeMB   = 3,
  accept      = 'image/jpeg,image/png,image/webp',
  aspectRatio = 'square',
  className,
  placeholder = 'کلیک کنید یا تصویر را اینجا بکشید',
}: Props) {
  const [preview, setPreview] = useState<string | null>(value ?? null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const heightClass =
    aspectRatio === 'square' ? 'h-44' :
    aspectRatio === 'video'  ? 'h-36' :
    'h-40'

  const processFile = (file: File) => {
    // اعتبارسنجی حجم
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`حجم تصویر نباید بیشتر از ${maxSizeMB} مگابایت باشد`)
      return
    }

    // اعتبارسنجی نوع
    const validTypes = accept.split(',').map((t) => t.trim())
    if (!validTypes.includes(file.type)) {
      toast.error('فرمت تصویر پشتیبانی نمی‌شود')
      return
    }

    // ساخت preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    onChange(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    // reset input برای انتخاب مجدد همان فایل
    e.target.value = ''
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    onChange(null)
    onClear?.()
  }

  // ── Drag & Drop ──
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative flex items-center justify-center w-full',
          'rounded-2xl border-2 border-dashed cursor-pointer',
          'transition-all duration-200',
          heightClass,
          // حالت‌های مختلف
          isDragging
            ? 'border-brand bg-brand-subtle scale-[1.01]'
            : preview
              ? 'border-brand bg-brand-subtle/30'
              : 'border-ui-border bg-ui-bg-soft hover:border-brand hover:bg-brand-subtle/20'
        )}
      >
        {preview ? (
          <>
            {/* پیش‌نمایش تصویر */}
            <Image
              src={preview}
              alt="پیش‌نمایش"
              fill
              className="object-cover rounded-2xl"
            />

            {/* دکمه حذف */}
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                'absolute top-2 left-2 z-10',
                'flex h-7 w-7 items-center justify-center',
                'rounded-full bg-red-500 text-white shadow-md',
                'hover:bg-red-600 transition-colors duration-150',
                'active:scale-95'
              )}
              aria-label="حذف تصویر"
            >
              <IconX size={14} stroke={2.5} />
            </button>

            {/* overlay هنگام hover */}
            <div className={cn(
              'absolute inset-0 rounded-2xl',
              'bg-black/0 hover:bg-black/20',
              'transition-colors duration-200',
              'flex items-center justify-center'
            )}>
              <div className="opacity-0 hover:opacity-100 transition-opacity">
                <div className="bg-white/90 rounded-xl px-3 py-1.5
                                text-xs font-medium text-gray-700">
                  تغییر تصویر
                </div>
              </div>
            </div>
          </>
        ) : (
          /* حالت خالی */
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <div className={cn(
              'flex h-12 w-12 items-center justify-center rounded-2xl',
              isDragging ? 'bg-brand text-white' : 'bg-ui-bg-muted text-ui-text-muted'
            )}>
              {isDragging
                ? <IconUpload size={22} stroke={2} />
                : <IconPhoto  size={22} stroke={1.5} />
              }
            </div>
            <div>
              <p className="text-sm text-ui-text-soft font-medium">
                {isDragging ? 'رها کنید...' : placeholder}
              </p>
              <p className="text-xs text-ui-text-muted mt-0.5">
                JPG، PNG، WEBP — حداکثر {maxSizeMB} مگابایت
              </p>
            </div>
          </div>
        )}
      </div>

      {/* input مخفی */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  )
}