'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Event, EventType } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Phone, Mail, Eye, FileText, StickyNote, Plus, X } from 'lucide-react'

const typeConfig: Record<EventType, { icon: React.ReactNode; color: string; bg: string }> = {
  call:    { icon: <Phone className="w-3.5 h-3.5" />,     color: 'text-blue-600',   bg: 'bg-blue-100' },
  email:   { icon: <Mail className="w-3.5 h-3.5" />,      color: 'text-purple-600', bg: 'bg-purple-100' },
  showing: { icon: <Eye className="w-3.5 h-3.5" />,       color: 'text-emerald-600',bg: 'bg-emerald-100' },
  offer:   { icon: <FileText className="w-3.5 h-3.5" />,  color: 'text-amber-600',  bg: 'bg-amber-100' },
  note:    { icon: <StickyNote className="w-3.5 h-3.5" />,color: 'text-gray-600',   bg: 'bg-gray-100' },
}

interface EventTimelineProps {
  clientId: string
  initialEvents: Event[]
}

export default function EventTimeline({ clientId, initialEvents }: EventTimelineProps) {
  const t = useTranslations('clients')
  const [events, setEvents] = useState(initialEvents)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    type: 'call' as EventType,
    title: '',
    notes: '',
    event_date: new Date().toISOString().slice(0, 16),
  })

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, client_id: clientId }),
    })
    const created = await res.json()
    setEvents((prev) => [created, ...prev])
    setShowForm(false)
    setForm({ type: 'call', title: '', notes: '', event_date: new Date().toISOString().slice(0, 16) })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-navy-700">{t('detail.timeline')}</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-secondary text-xs py-1.5">
          <Plus className="w-3.5 h-3.5" />
          {t('detail.addEvent')}
        </button>
      </div>

      {/* Add event form */}
      {showForm && (
        <div className="card p-4 mb-4 border-l-4 border-navy-700">
          <form onSubmit={handleAddEvent} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">{t('events.type')}</label>
                <select
                  className="input"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as EventType })}
                >
                  {(['call', 'email', 'showing', 'offer', 'note'] as EventType[]).map((type) => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">{t('events.date')}</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={form.event_date}
                  onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="label">{t('events.title')}</label>
              <input
                className="input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">{t('events.notes')}</label>
              <textarea
                className="input resize-none"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-xs py-1.5">{t('events.save')}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-xs py-1.5">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timeline */}
      {events.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No activity logged yet.</p>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100" />
          <ul className="space-y-4">
            {events.map((event) => {
              const cfg = typeConfig[event.type]
              return (
                <li key={event.id} className="flex gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${cfg.bg} ${cfg.color}`}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-gray-800">{event.title}</span>
                      <span className={`badge ${cfg.bg} ${cfg.color} border-0`}>{event.type}</span>
                    </div>
                    {event.notes && (
                      <p className="text-xs text-gray-500 mb-1">{event.notes}</p>
                    )}
                    <span className="text-xs text-gray-400">{formatDate(event.event_date)}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
