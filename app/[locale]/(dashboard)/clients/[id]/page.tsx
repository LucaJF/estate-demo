import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getTranslations, getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, DollarSign } from 'lucide-react'
import EventTimeline from '@/components/clients/EventTimeline'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Client, Event } from '@/lib/types'

export default async function ClientDetailPage({ params }: { params: { id: string; locale: string } }) {
  const t = await getTranslations('clients')
  const locale = await getLocale()
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const [{ data: client }, { data: events }] = await Promise.all([
    supabase.from('clients').select('*').eq('id', params.id).eq('user_id', user.id).single(),
    supabase.from('events').select('*').eq('client_id', params.id).order('event_date', { ascending: false }),
  ])

  if (!client) notFound()

  const c = client as Client
  const ev = (events ?? []) as Event[]

  const statusClass =
    c.status === 'active' ? 'badge-active' :
    c.status === 'pending' ? 'badge-pending' : 'badge-closed'

  return (
    <div className="p-8 max-w-4xl">
      {/* Back */}
      <Link href={`/${locale}/clients`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        {t('title')}
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-navy-700 text-white flex items-center justify-center text-xl font-semibold flex-shrink-0">
          {c.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-serif text-2xl font-semibold text-navy-700">{c.name}</h1>
            <span className={statusClass}>{c.status}</span>
          </div>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            {c.email && (
              <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-700">
                <Mail className="w-3.5 h-3.5" /> {c.email}
              </a>
            )}
            {c.phone && (
              <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-700">
                <Phone className="w-3.5 h-3.5" /> {c.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: info cards */}
        <div className="space-y-4">
          {/* Budget */}
          {(c.budget_min || c.budget_max) && (
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-gold-500" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('detail.budget')}</span>
              </div>
              <div className="text-lg font-semibold text-navy-700">
                {c.budget_min ? formatCurrency(c.budget_min) : '—'}
                {' – '}
                {c.budget_max ? formatCurrency(c.budget_max) : '—'}
              </div>
            </div>
          )}

          {/* Areas */}
          {c.preferred_areas && c.preferred_areas.length > 0 && (
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gold-500" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('detail.areas')}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {c.preferred_areas.map((area: string) => (
                  <span key={area} className="px-2.5 py-1 bg-navy-50 text-navy-700 text-xs rounded-full border border-navy-100">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Next follow-up */}
          {c.follow_up_date && (
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-gold-500" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('detail.nextFollowUp')}</span>
              </div>
              <div className="text-sm font-medium text-navy-700">{formatDate(c.follow_up_date)}</div>
            </div>
          )}
        </div>

        {/* Right: timeline */}
        <div className="lg:col-span-2 card p-5">
          <EventTimeline clientId={c.id} initialEvents={ev} />
        </div>
      </div>
    </div>
  )
}
