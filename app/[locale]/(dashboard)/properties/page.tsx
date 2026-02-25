import { createServerSupabaseClient } from '@/lib/supabase-server'
import PropertiesClient from '@/components/properties/PropertiesClient'
import { Property } from '@/lib/types'

export default async function PropertiesPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  let properties: Property[] = []
  if (user) {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    properties = data ?? []
  }

  return (
    <div className="p-8">
      <PropertiesClient initialProperties={properties} />
    </div>
  )
}
