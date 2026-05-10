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

export type Rarity = 'common' | 'rare' | 'super-rare'

export type DimensionScores = Record<Dimension, number>

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
  sceneEn?: string
  sceneEmoji: string
  timeOfDay: 'morning' | 'midday' | 'afternoon' | 'evening' | 'night'
  question: string
  questionEn?: string
  context: string
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
}
