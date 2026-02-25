'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Sparkles, ChevronRight } from 'lucide-react'
import { Client, Property } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface MatchWidgetProps {
  clients: Client[]
  properties: Property[]
}

function getMatches(clients: Client[], properties: Property[]) {
  const matches: { client: Client; property: Property }[] = []

  for (const client of clients) {
    if (client.status === 'closed') continue
    for (const property of properties) {
      if (property.status !== 'available') continue

      const withinBudget =
        (!client.budget_min || property.price >= client.budget_min) &&
        (!client.budget_max || property.price <= client.budget_max)

      const areaMatch =
        !client.preferred_areas ||
        client.preferred_areas.length === 0 ||
        (property.area_name &&
          client.preferred_areas.some((a) =>
            property.area_name!.toLowerCase().includes(a.toLowerCase()) ||
            a.toLowerCase().includes(property.area_name!.toLowerCase())
          ))

      if (withinBudget && areaMatch) {
        matches.push({ client, property })
        if (matches.length >= 4) return matches
      }
    }
  }
  return matches
}

export default function MatchWidget({ clients, properties }: MatchWidgetProps) {
  const t = useTranslations('dashboard.matches')
  const locale = useLocale()
  const matches = getMatches(clients, properties)

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-gold-500" />
        <h2 className="font-semibold text-navy-700">{t('title')}</h2>
      </div>
      <p className="text-xs text-gray-400 mb-4">{t('subtitle')}</p>

      {matches.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">{t('empty')}</p>
      ) : (
        <ul className="space-y-3">
          {matches.map(({ client, property }, i) => (
            <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-800 truncate">{client.name}</span>
                  <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-500 truncate">{property.area_name}</span>
                </div>
                <div className="text-xs text-gray-500 truncate">{property.address}</div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs font-semibold text-gold-600">
                    {formatCurrency(property.price)}
                  </span>
                  {client.budget_max && (
                    <span className="text-xs text-gray-400">
                      {t('budget')}: {formatCurrency(client.budget_max)}
                    </span>
                  )}
                </div>
              </div>
              <Link
                href={`/${locale}/clients/${client.id}`}
                className="text-xs text-navy-700 font-medium hover:underline flex-shrink-0"
              >
                {t('viewClient')}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
