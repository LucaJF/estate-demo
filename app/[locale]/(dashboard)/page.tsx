import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getTranslations } from 'next-intl/server'
import StatsCards from '@/components/dashboard/StatsCards'
import RemindersWidget from '@/components/dashboard/RemindersWidget'
import MatchWidget from '@/components/dashboard/MatchWidget'
import { Client, Property } from '@/lib/types'

export default async function DashboardPage() {
  const t = await getTranslations('dashboard')
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  let clients: Client[] = []
  let properties: Property[] = []

  if (user) {
    const [{ data: c }, { data: p }] = await Promise.all([
      supabase.from('clients').select('*').eq('user_id', user.id),
      supabase.from('properties').select('*').eq('user_id', user.id),
    ])
    clients = c ?? []
    properties = p ?? []
  }

  const today = new Date().toISOString().split('T')[0]
  const weekEnd = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

  const activeClients = clients.filter((c) => c.status === 'active').length
  const followUpsThisWeek = clients.filter(
    (c) => c.follow_up_date && c.follow_up_date >= today && c.follow_up_date <= weekEnd
  ).length
  const availableListings = properties.filter((p) => p.status === 'available').length
  const closedDeals = clients.filter((c) => c.status === 'closed').length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-navy-700">{t('title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('subtitle')}</p>
      </div>

      <StatsCards
        activeClients={activeClients}
        followUpsThisWeek={followUpsThisWeek}
        availableListings={availableListings}
        closedDeals={closedDeals}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <RemindersWidget clients={clients} />
        <MatchWidget clients={clients} properties={properties} />
      </div>
    </div>
  )
}
