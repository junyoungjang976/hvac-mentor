import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface DiagnosisRecord {
  id?: string
  created_at?: string
  refrigerant: string
  facility_type: string
  low_pressure: number
  high_pressure: number
  superheat?: number
  subcooling?: number
  severity: string
  issues: string[]
  actions: string[]
  ai_response?: string
}

export interface Equipment {
  id?: string
  name: string
  location: string
  refrigerant: string
  model?: string
  install_date?: string
}

// Functions
export async function saveDiagnosis(diagnosis: DiagnosisRecord) {
  const { data, error } = await supabase
    .from('hvac_diagnoses')
    .insert(diagnosis)
    .select()

  if (error) throw error
  return data
}

export async function getDiagnoses(limit = 50) {
  const { data, error } = await supabase
    .from('hvac_diagnoses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
