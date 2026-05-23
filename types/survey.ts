export type Dimension =
  | 'social'
  | 'occupational'
  | 'intellectual'
  | 'environmental'
  | 'spiritual'
  | 'financial'
  | 'emotional'
  | 'physical'
  | 'burnout'

export type Lang = 'th' | 'en'
export type Rarity = 'common' | 'rare' | 'legendary'

export type DimensionScores = Record<Dimension, number>

export interface HRDActivity {
  name: string
  description: string
}

export interface Choice {
  id: string
  text: string
  textEn?: string
  emoji?: string
  scores: Partial<DimensionScores>
}

export interface Question {
  id: number
  scene: string
  sceneEn: string
  sceneName: string
  sceneNameEn: string
  sceneEmoji: string
  timeOfDay: 'morning' | 'midday' | 'afternoon' | 'evening' | 'night'
  question: string
  questionEn?: string
  context?: string
  contextEn?: string
  choices: Choice[]
}

export interface Archetype {
  id: string
  name: string
  nameEn: string
  quote: string
  quoteEn: string
  tagline: string
  taglineEn: string
  description: string
  descriptionEn: string
  traits: string[]
  traitsEn: string[]
  rarity: Rarity
  stressLevel: number       // 1–10
  stressLabel: string       // Thai e.g. "7/10 — ..."
  hrdActivities: HRDActivity[]
  friendBeaver: string      // archetype id of paired character
  emoji: string
  color: string
  gradient: string
  dominantDimensions: Dimension[]
}

export interface SurveyAnswer {
  questionId: number
  choiceId: string
  scores: Partial<DimensionScores>
}

export interface SurveyResult {
  sessionId: string
  rawScores: DimensionScores
  normalizedScores: DimensionScores
  archetype: Archetype
  completedAt: string
  selectedActivities?: string[]
  dimensionTotals?: DimensionScores
}
