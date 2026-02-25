'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Client, ClientStatus } from '@/lib/types'
import { X } from 'lucide-react'

interface ClientFormProps {
  client: Client | null
  onSave: (data: Partial<Client>) => void
  onClose: () => void
}

export default function ClientForm({ client, onSave, onClose }: ClientFormProps) {
  const t = useTranslations('clients.form')
  const [form, setForm] = useState({
    name: client?.name ?? '',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
    budget_min: client?.budget_min?.toString() ?? '',
    budget_max: client?.budget_max?.toString() ?? '',
    preferred_areas: client?.preferred_areas?.join(', ') ?? '',
    status: client?.status ?? 'active' as ClientStatus,
    follow_up_date: client?.follow_up_date ?? '',
    notes: client?.notes ?? '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      budget_min: form.budget_min ? Number(form.budget_min) : null,
      budget_max: form.budget_max ? Number(form.budget_max) : null,
      preferred_areas: form.preferred_areas
        ? form.preferred_areas.split(',').map((s) => s.trim()).filter(Boolean)
        : null,
      status: form.status,
      follow_up_date: form.follow_up_date || null,
      notes: form.notes || null,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-serif text-lg font-semibold text-navy-700">
            {client ? t('editTitle') : t('addTitle')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">{t('name')} *</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">{t('email')}</label>
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="label">{t('phone')}</label>
              <input
                className="input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">{t('budgetMin')}</label>
              <input
                type="number"
                className="input"
                value={form.budget_min}
                onChange={(e) => setForm({ ...form, budget_min: e.target.value })}
              />
            </div>
            <div>
              <label className="label">{t('budgetMax')}</label>
              <input
                type="number"
                className="input"
                value={form.budget_max}
                onChange={(e) => setForm({ ...form, budget_max: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label">{t('preferredAreas')}</label>
            <input
              className="input"
              placeholder={t('areasPlaceholder')}
              value={form.preferred_areas}
              onChange={(e) => setForm({ ...form, preferred_areas: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">{t('status')}</label>
              <select
                className="input"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ClientStatus })}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="label">{t('followUpDate')}</label>
              <input
                type="date"
                className="input"
                value={form.follow_up_date}
                onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 justify-center">
              {t('save')}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
