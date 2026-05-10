import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface SurveyResponseRow {
  session_id: string
  answers: object
  raw_scores: object
  normalized_scores: object
  archetype_id: string
  completed_at: string
  user_agent?: string
  referrer?: string
}

export async function saveSurveyResponse(row: SurveyResponseRow) {
  const { data, error } = await supabase
    .from('survey_responses')
    .insert([row])
    .select()
    .single()

  if (error) throw error
  return data
}
