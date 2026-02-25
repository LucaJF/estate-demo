import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getTranslations } from 'next-intl/server'
import ClientTable from '@/components/clients/ClientTable'
import { Client } from '@/lib/types'

export default async function ClientsPage() {
  await getTranslations('clients')
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  let clients: Client[] = []
  if (user) {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    clients = data ?? []
  }

  return (
    <div className="p-8">
      <ClientTable initialClients={clients} />
    </div>
  )
}
