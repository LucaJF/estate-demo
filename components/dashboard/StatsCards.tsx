'use client'

import { useTranslations } from 'next-intl'
import { Users, CalendarCheck, Home, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardsProps {
  activeClients: number
  followUpsThisWeek: number
  availableListings: number
  closedDeals: number
}

const stats = [
  {
    key: 'activeClients' as const,
    icon: Users,
    accent: 'bg-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    key: 'followUpsThisWeek' as const,
    icon: CalendarCheck,
    accent: 'bg-amber-500',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
  },
  {
    key: 'availableListings' as const,
    icon: Home,
    accent: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    key: 'closedDeals' as const,
    icon: TrendingUp,
    accent: 'bg-purple-500',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
  },
]

export default function StatsCards(props: StatsCardsProps) {
  const t = useTranslations('dashboard.stats')

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ key, icon: Icon, accent, bg, text }) => (
        <div key={key} className="stat-card">
          <div className={cn('w-1 self-stretch rounded-full flex-shrink-0', accent)} />
          <div className="flex-1 min-w-0">
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-3', bg)}>
              <Icon className={cn('w-4 h-4', text)} />
            </div>
            <div className="text-2xl font-bold text-navy-700">{props[key]}</div>
            <div className="text-xs text-gray-500 mt-0.5">{t(key)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
