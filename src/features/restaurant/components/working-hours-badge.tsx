'use client'

import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type DaySchedule = {
  open:      string
  close:     string
  is_closed: boolean
}

type WorkingHours = Record<string, DaySchedule>

const DAY_NAMES: Record<string, string> = {
  saturday:  'شنبه',
  sunday:    'یکشنبه',
  monday:    'دوشنبه',
  tuesday:   'سه‌شنبه',
  wednesday: 'چهارشنبه',
  thursday:  'پنجشنبه',
  friday:    'جمعه',
}

const TODAY_MAP: Record<number, string> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
}

function isOpenNow(hours: WorkingHours): boolean {
  const today   = TODAY_MAP[new Date().getDay()]
  const schedule = hours[today]
  if (!schedule || schedule.is_closed) return false

  const now   = new Date()
  const [oh, om] = schedule.open.split(':').map(Number)
  const [ch, cm] = schedule.close.split(':').map(Number)

  const nowMin   = now.getHours() * 60 + now.getMinutes()
  const openMin  = oh * 60 + om
  const closeMin = ch * 60 + cm

  return nowMin >= openMin && nowMin <= closeMin
}

type Props = { workingHours: Record<string, unknown> }

export function WorkingHoursBadge({ workingHours }: Props) {
  const hours  = workingHours as WorkingHours
  const isOpen = Object.keys(hours).length > 0 && isOpenNow(hours)

  return (
    <Badge variant={isOpen ? 'success' : 'destructive'}>
      <Clock className="h-3 w-3" />
      {isOpen ? 'اکنون باز است' : 'اکنون بسته است'}
    </Badge>
  )
}

export function WorkingHoursTable({ workingHours }: Props) {
  const hours = workingHours as WorkingHours
  if (Object.keys(hours).length === 0) return null

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4 text-brand-600" />
        ساعات کاری
      </h3>
      <div className="space-y-2">
        {Object.entries(DAY_NAMES).map(([key, label]) => {
          const schedule = hours[key]
          if (!schedule) return null
          return (
            <div
              key={key}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-500">{label}</span>
              {schedule.is_closed ? (
                <span className="text-red-400 text-xs">تعطیل</span>
              ) : (
                <span className="text-gray-700 font-medium tabular-nums" dir="ltr">
                  {schedule.open} – {schedule.close}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}