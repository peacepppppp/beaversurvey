import { Dimension, DimensionScores, SurveyAnswer, SurveyResult } from '@/types/survey'
import { ARCHETYPES } from '@/data/archetypes'
import { QUESTIONS } from '@/data/questions'

const SCORED_DIMENSIONS: Dimension[] = [
  'social', 'occupational', 'intellectual', 'environmental',
  'spiritual', 'financial', 'emotional', 'physical',
]
const ALL_DIMENSIONS: Dimension[] = [...SCORED_DIMENSIONS, 'burnout']

function emptyScores(): DimensionScores {
  return {
    social: 0, occupational: 0, intellectual: 0, environmental: 0,
    spiritual: 0, financial: 0, emotional: 0, physical: 0, burnout: 0,
  }
}

export function calculateRawScores(answers: SurveyAnswer[]): DimensionScores {
  const raw = emptyScores()
  for (const answer of answers) {
    for (const dim of ALL_DIMENSIONS) {
      raw[dim] += answer.scores[dim] ?? 0
    }
  }
  return raw
}

function computeTheoreticalMax(): DimensionScores {
  const maxScores = emptyScores()
  for (const question of QUESTIONS) {
    const dimMaxes = emptyScores()
    for (const choice of question.choices) {
      for (const dim of ALL_DIMENSIONS) {
        const val = choice.scores[dim] ?? 0
        if (val > dimMaxes[dim]) dimMaxes[dim] = val
      }
    }
    for (const dim of ALL_DIMENSIONS) {
      maxScores[dim] += dimMaxes[dim]
    }
  }
  return maxScores
}

export function normalizeScores(raw: DimensionScores): DimensionScores {
  const theoretical = computeTheoreticalMax()
  const normalized = emptyScores()
  for (const dim of ALL_DIMENSIONS) {
    const max = theoretical[dim]
    normalized[dim] = max > 0 ? Math.max(0, Math.round((raw[dim] / max) * 100)) : 0
  }
  return normalized
}

export function selectArchetype(s: DimensionScores) {
  const {
    social: SOC, occupational: OCC, intellectual: INT, environmental: ENV,
    spiritual: SPI, financial: FIN, emotional: EMO, physical: PHY,
    burnout: BURN,
  } = s

  const vals = SCORED_DIMENSIONS.map((d) => s[d])
  const maxVal = Math.max(...vals)
  const minVal = Math.min(...vals)
  const topDim = SCORED_DIMENSIONS.slice().sort((a, b) => s[b] - s[a])[0]
  const allInRange = (lo: number, hi: number) => vals.every((v) => v >= lo && v <= hi)

  // ── LEGENDARY (check first) ──────────────────────────────────────────────
  if (OCC >= 80 && EMO <= 40 && PHY <= 40 && BURN >= 75)
    return ARCHETYPES.find((a) => a.id === 'three-am-survivor')!

  if (allInRange(55, 75) && BURN <= 30)
    return ARCHETYPES.find((a) => a.id === 'beaver-king')!

  if (SPI >= 80 && INT >= 65 && OCC <= 50)
    return ARCHETYPES.find((a) => a.id === 'arcane-beaver')!

  // ── RARE ─────────────────────────────────────────────────────────────────
  if (OCC >= 70 && SOC >= 70)
    return ARCHETYPES.find((a) => a.id === 'dam-commander')!

  if (EMO >= 80 && SOC <= 45)
    return ARCHETYPES.find((a) => a.id === 'rainwatcher')!

  if (maxVal < 60 && maxVal - minVal <= 15)
    return ARCHETYPES.find((a) => a.id === 'chaos-rodent')!

  // ── COMMON: rare-adjacent thresholds first ───────────────────────────────
  if (INT >= 80)
    return ARCHETYPES.find((a) => a.id === 'blueprint-brain')!

  if (FIN >= 75)
    return ARCHETYPES.find((a) => a.id === 'budget-beaver')!

  // ── COMMON: by highest dimension ─────────────────────────────────────────
  if (topDim === 'occupational' && OCC >= 65)
    return ARCHETYPES.find((a) => a.id === 'lumber-loader')!

  if (topDim === 'physical' && BURN <= 40)
    return ARCHETYPES.find((a) => a.id === 'snack-breaker')!

  if (topDim === 'social' && SOC >= 65)
    return ARCHETYPES.find((a) => a.id === 'campfire-buddy')!

  if (topDim === 'emotional' && SOC >= 35 && SOC <= 65)
    return ARCHETYPES.find((a) => a.id === 'lofi-listener')!

  // ── Fallback by top dimension ─────────────────────────────────────────────
  const fallback: Partial<Record<Dimension, string>> = {
    occupational: 'lumber-loader',
    physical:     'snack-breaker',
    social:       'campfire-buddy',
    emotional:    'lofi-listener',
    intellectual: 'blueprint-brain',
    financial:    'budget-beaver',
    spiritual:    'arcane-beaver',
    environmental:'lofi-listener',
    burnout:      'lumber-loader',
  }

  return ARCHETYPES.find((a) => a.id === (fallback[topDim] ?? 'lumber-loader'))!
}

export function buildResult(answers: SurveyAnswer[]): Omit<SurveyResult, 'sessionId' | 'completedAt'> {
  const rawScores = calculateRawScores(answers)
  const normalizedScores = normalizeScores(rawScores)
  const archetype = selectArchetype(normalizedScores)
  return { rawScores, normalizedScores, archetype }
}
