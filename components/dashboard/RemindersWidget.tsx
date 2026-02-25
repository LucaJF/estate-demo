'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Phone, Mail, Eye, FileText, Home, ChevronRight } from 'lucide-react'
import { Client, EventType } from '@/lib/types'
import { formatDate } from '@/lib/utils'

const eventIcons: Record<EventType, React.ReactNode> = {
  call: <Phone className="w-3.5 h-3.5" />,
  email: <Mail className="w-3.5 h-3.5" />,
  showing: <Eye className="w-3.5 h-3.5" />,
  offer: <FileText className="w-3.5 h-3.5" />,
  note: <Home className="w-3.5 h-3.5" />,
}

interface RemindersWidgetProps {
  clients: Client[]
}

export default function RemindersWidget({ clients }: RemindersWidgetProps) {
  const t = useTranslations('dashboard.reminders')
  const locale = useLocale()

  const today = new Date().toISOString().split('T')[0]
  const due = clients
    .filter((c) => c.follow_up_date && c.follow_up_date <= today && c.status !== 'closed')
    .sort((a, b) => (a.follow_up_date! > b.follow_up_date! ? 1 : -1))
    .slice(0, 6)

  return (
    <div className="card p-5">
      <h2 className="font-semibold text-navy-700 mb-4">{t('title')}</h2>
      {due.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">{t('empty')}</p>
      ) : (
        <ul className="space-y-2">
          {due.map((client) => (
            <li key={client.id}>
              <Link
                href={`/${locale}/clients/${client.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-navy-700 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {client.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{client.name}</div>
                  <div className="text-xs text-gray-400">{formatDate(client.follow_up_date)}</div>
                </div>
                <span
                  className={`badge ${
                    client.status === 'active' ? 'badge-active' : 'badge-pending'
                  }`}
                >
                  {client.status}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
