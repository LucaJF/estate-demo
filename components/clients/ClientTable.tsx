'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Client, ClientStatus } from '@/lib/types'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { Search, Plus, ChevronRight, Phone, Mail } from 'lucide-react'
import ClientForm from './ClientForm'

interface ClientTableProps {
  initialClients: Client[]
}

export default function ClientTable({ initialClients }: ClientTableProps) {
  const t = useTranslations('clients')
  const locale = useLocale()
  const router = useRouter()
  const [clients, setClients] = useState(initialClients)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | ClientStatus>('all')
  const [showForm, setShowForm] = useState(false)
  const [editClient, setEditClient] = useState<Client | null>(null)

  const filtered = clients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email ?? '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  async function handleSave(data: Partial<Client>) {
    if (editClient) {
      const res = await fetch(`/api/clients/${editClient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const updated = await res.json()
      setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    } else {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const created = await res.json()
      setClients((prev) => [created, ...prev])
    }
    setShowForm(false)
    setEditClient(null)
  }

  async function handleDelete(id: string) {
    await fetch(`/api/clients/${id}`, { method: 'DELETE' })
    setClients((prev) => prev.filter((c) => c.id !== id))
  }

  const filterTabs: { key: 'all' | ClientStatus; label: string }[] = [
    { key: 'all', label: t('all') },
    { key: 'active', label: t('active') },
    { key: 'pending', label: t('pending') },
    { key: 'closed', label: t('closed') },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-navy-700">{t('title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('subtitle')}</p>
        </div>
        <button onClick={() => { setEditClient(null); setShowForm(true) }} className="btn-primary">
          <Plus className="w-4 h-4" />
          {t('addClient')}
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input pl-9"
            placeholder={t('search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                filter === key
                  ? 'bg-navy-700 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">{t('table.name')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 hidden md:table-cell">{t('table.contact')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 hidden lg:table-cell">{t('table.budget')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 hidden lg:table-cell">{t('table.area')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">{t('table.status')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 hidden md:table-cell">{t('table.followUp')}</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-sm text-gray-400 py-12">
                  {t('search') && search ? 'No results found.' : t('all')}
                </td>
              </tr>
            ) : (
              filtered.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                  onClick={() => router.push(`/${locale}/clients/${client.id}`)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-navy-700 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {client.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <div className="space-y-0.5">
                      {client.email && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Mail className="w-3 h-3" />{client.email}
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Phone className="w-3 h-3" />{client.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-sm text-gray-600">
                      {client.budget_min && client.budget_max
                        ? `${formatCurrency(client.budget_min)} – ${formatCurrency(client.budget_max)}`
                        : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-sm text-gray-600">
                      {client.preferred_areas?.join(', ') || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`badge badge-${client.status}`}>{client.status}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-sm text-gray-500">{formatDate(client.follow_up_date)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => { setEditClient(client); setShowForm(true) }}
                        className="text-xs text-navy-700 hover:underline"
                      >
                        Edit
                      </button>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form modal */}
      {showForm && (
        <ClientForm
          client={editClient}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditClient(null) }}
        />
      )}
    </div>
  )
}
