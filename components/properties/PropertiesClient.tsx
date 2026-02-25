'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Property, PropertyStatus } from '@/lib/types'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { Search, Plus, Home, Bed, Bath, Maximize2, X } from 'lucide-react'

interface PropertiesClientProps {
  initialProperties: Property[]
}

const statusClass: Record<PropertyStatus, string> = {
  available: 'badge-available',
  pending: 'badge-pending',
  sold: 'badge-closed',
}

export default function PropertiesClient({ initialProperties }: PropertiesClientProps) {
  const t = useTranslations('properties')
  const [properties, setProperties] = useState(initialProperties)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | PropertyStatus>('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    address: '', price: '', area_sqft: '', bedrooms: '',
    bathrooms: '', area_name: '', status: 'available' as PropertyStatus,
  })

  const filtered = properties.filter((p) => {
    const matchSearch = p.address.toLowerCase().includes(search.toLowerCase()) ||
      (p.area_name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: form.address,
        price: Number(form.price),
        area_sqft: form.area_sqft ? Number(form.area_sqft) : null,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        area_name: form.area_name || null,
        status: form.status,
      }),
    })
    const created = await res.json()
    setProperties((prev) => [created, ...prev])
    setShowForm(false)
    setForm({ address: '', price: '', area_sqft: '', bedrooms: '', bathrooms: '', area_name: '', status: 'available' })
  }

  const filterTabs: { key: 'all' | PropertyStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'available', label: t('available') },
    { key: 'pending', label: t('pending') },
    { key: 'sold', label: t('sold') },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-navy-700">{t('title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('subtitle')}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          {t('addProperty')}
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="input pl-9" placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                filter === key ? 'bg-navy-700 text-white' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="card overflow-hidden hover:shadow-md transition-shadow">
            {/* Image placeholder */}
            <div className="h-36 bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
              <Home className="w-10 h-10 text-white/20" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="text-lg font-bold text-navy-700">{formatCurrency(p.price)}</div>
                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{p.address}</div>
                </div>
                <span className={statusClass[p.status]}>{p.status}</span>
              </div>
              {p.area_name && (
                <div className="text-xs text-gold-600 font-medium mb-2">{p.area_name}</div>
              )}
              <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t border-gray-50">
                {p.bedrooms != null && (
                  <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{p.bedrooms} bd</span>
                )}
                {p.bathrooms != null && (
                  <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{p.bathrooms} ba</span>
                )}
                {p.area_sqft != null && (
                  <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" />{p.area_sqft.toLocaleString()} sqft</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-sm text-gray-400 py-16">No properties found.</div>
        )}
      </div>

      {/* Add form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-serif text-lg font-semibold text-navy-700">{t('addProperty')}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4">
              <div>
                <label className="label">Address *</label>
                <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Price ($) *</label>
                  <input type="number" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Area / Neighborhood</label>
                  <input className="input" value={form.area_name} onChange={(e) => setForm({ ...form, area_name: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Beds</label>
                  <input type="number" className="input" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
                </div>
                <div>
                  <label className="label">Baths</label>
                  <input type="number" step="0.5" className="input" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
                </div>
                <div>
                  <label className="label">Sqft</label>
                  <input type="number" className="input" value={form.area_sqft} onChange={(e) => setForm({ ...form, area_sqft: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PropertyStatus })}>
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 justify-center">Add Property</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
