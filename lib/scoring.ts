import { Dimension, DimensionScores, SurveyAnswer, SurveyResult, Archetype } from '@/types/survey'
import { ARCHETYPES } from '@/data/archetypes'

const DIMENSIONS: Dimension[] = [
  'social', 'occupational', 'intellectual', 'environmental',
  'spiritual', 'financial', 'emotional', 'physical',
]

function emptyScores(): DimensionScores {
  return {
    social: 0, occupational: 0, intellectual: 0, environmental: 0,
    spiritual: 0, financial: 0, emotional: 0, physical: 0, burnout: 0,
  }
}

export function calculateRawScores(answers: SurveyAnswer[]): DimensionScores {
  const totals = emptyScores()
  for (const a of answers) {
    for (const dim of DIMENSIONS) {
      const v = a.scores[dim] ?? 0
      totals[dim] += v
    }
  }
  return totals
}

export function normalizeScores(raw: DimensionScores): DimensionScores {
  // normalize to percentage of max possible (12 questions)
  const normalized = emptyScores()
  const max = 12
  for (const dim of DIMENSIONS) {
    normalized[dim] = Math.round((raw[dim] / max) * 100)
  }
  normalized.burnout = 0
  return normalized
}

const TIE_PRIORITY: Dimension[] = [
  'intellectual','occupational','social','emotional','physical','spiritual','environmental','financial'
]

const RARE_MAP: Record<Dimension, { rare: string; normal: string }> = {
  physical:     { rare: 'lumber-loader', normal: 'snack-breaker' },
  social:       { rare: 'chaos-rodent', normal: 'campfire-buddy' },
  environmental:{ rare: 'cozy-builder', normal: 'cozy-builder' },
  intellectual: { rare: 'alchemist-beaver', normal: 'blueprint-brain' },
  occupational: { rare: '3am-survivor', normal: 'dam-commander' },
  emotional:    { rare: 'rainwatcher', normal: 'rainwatcher' },
  spiritual:    { rare: 'cosmic-beaver', normal: 'cosmic-beaver' },
  financial:    { rare: 'beaver-king', normal: 'beaver-king' },
}

function findArchetypeById(id: string): Archetype | null {
  const a = ARCHETYPES.find((x) => x.id === id)
  return a ?? null
}

function buildMinimalArchetype(id: string, displayName: string): Archetype {
  return {
    id,
    name: displayName,
    nameEn: displayName,
    quote: '', quoteEn: '', tagline: '', taglineEn: '',
    description: '', descriptionEn: '', traits: [], traitsEn: [],
    rarity: 'common', stressLevel: 5, stressLabel: '5/10', hrdActivities: [],
    friendBeaver: '', emoji: '🦫', color: '#888', gradient: 'from-gray-300 to-gray-500', dominantDimensions: []
  }
}

export function selectArchetype(raw: DimensionScores) {
  // find top score(s)
  const vals = DIMENSIONS.map((d) => ({ d, v: raw[d] }))
  const maxVal = Math.max(...vals.map((x) => x.v))
  const topDims = vals.filter((x) => x.v === maxVal).map((x) => x.d)

  // tie-breaker
  let chosen: Dimension
  if (topDims.length === 1) chosen = topDims[0]
  else {
    chosen = TIE_PRIORITY.find((p) => topDims.includes(p)) ?? topDims[0]
  }

  // rare rule: if score >= 9 -> rare
  const isRare = maxVal >= 9
  const map = RARE_MAP[chosen]
  const archetypeId = isRare ? map.rare : map.normal

  const found = findArchetypeById(archetypeId)
  if (found) return found

  // fallback minimal archetype
  const displayName = archetypeId.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join(' ')
  return buildMinimalArchetype(archetypeId, displayName)
}

export function buildResult(answers: SurveyAnswer[]): Omit<SurveyResult, 'sessionId' | 'completedAt'> {
  const rawScores = calculateRawScores(answers)
  const normalizedScores = normalizeScores(rawScores)
  const archetype = selectArchetype(rawScores)
  return { rawScores, normalizedScores, archetype }
}
