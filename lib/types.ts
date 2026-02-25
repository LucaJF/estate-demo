export type ClientStatus = 'active' | 'pending' | 'closed'
export type EventType = 'call' | 'email' | 'showing' | 'offer' | 'note'
export type PropertyStatus = 'available' | 'pending' | 'sold'

export interface Client {
  id: string
  user_id: string
  name: string
  email: string | null
  phone: string | null
  budget_min: number | null
  budget_max: number | null
  preferred_areas: string[] | null
  status: ClientStatus
  follow_up_date: string | null
  notes: string | null
  created_at: string
}

export interface Event {
  id: string
  client_id: string
  type: EventType
  title: string
  notes: string | null
  event_date: string
  created_at: string
}

export interface Property {
  id: string
  user_id: string
  address: string
  price: number
  area_sqft: number | null
  bedrooms: number | null
  bathrooms: number | null
  area_name: string | null
  status: PropertyStatus
  created_at: string
}

export interface ClientMatch {
  client: Client
  property: Property
}
