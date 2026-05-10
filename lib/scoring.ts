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
  for (const dim of SCORED_DIMENSIONS) {
    const max = theoretical[dim]
    normalized[dim] = max > 0 ? Math.round((raw[dim] / max) * 100) : 0
  }
  // Burnout: derived from OCC, PHY, EMO, SOC using weighted formula.
  // High OCC + low PHY/EMO/SOC = high burnout.
  // Formula: (OCC*2 - SOC - PHY - EMO + 100) / 2, clamped 0–100.
  const { occupational: OCC, social: SOC, physical: PHY, emotional: EMO } = normalized
  const rawBurnout = (OCC * 2 - SOC - PHY - EMO + 100) / 2
  normalized.burnout = Math.round(Math.min(100, Math.max(0, rawBurnout)))
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

  // ── SUPER RARE (check first — most specific conditions) ──────────────────
  // Mythic Worker: works hard, socially active, physically healthy, low burnout
  if (OCC >= 90 && SOC >= 70 && PHY >= 60 && BURN <= 40)
    return ARCHETYPES.find((a) => a.id === 'mythic-worker')!

  // Overclocked: extreme work + body collapse + extreme burnout
  if (OCC >= 90 && PHY <= 30 && BURN >= 85)
    return ARCHETYPES.find((a) => a.id === 'overclocked')!

  // 3AM Survivor: heavy work + emotional + physical depletion + high burnout
  if (OCC >= 80 && EMO <= 40 && PHY <= 40 && BURN >= 70)
    return ARCHETYPES.find((a) => a.id === 'three-am-survivor')!

  // Cosmic Beaver: deeply spiritual, low work drive, emotionally rich
  if (SPI >= 75 && OCC <= 45 && EMO >= 60)
    return ARCHETYPES.find((a) => a.id === 'cosmic-beaver')!

  // Beaver King: all dimensions balanced + low burnout
  if (allInRange(55, 75) && BURN <= 30)
    return ARCHETYPES.find((a) => a.id === 'beaver-king')!

  // ── RARE ────────────────────────────────────────────────────────────────
  // Dam Commander: both high OCC and high SOC, not critically burnt
  if (OCC >= 70 && SOC >= 70 && BURN < 75)
    return ARCHETYPES.find((a) => a.id === 'dam-commander')!

  // Blueprint Brain: high intellect + solid work
  if (INT >= 80 && OCC >= 55)
    return ARCHETYPES.find((a) => a.id === 'blueprint-brain')!

  // Rainwatcher: very emotional + solitary + spiritual
  if (EMO >= 80 && SOC <= 45 && SPI >= 55)
    return ARCHETYPES.find((a) => a.id === 'rainwatcher')!

  // Budget Beaver: financially focused + working
  if (FIN >= 75 && OCC >= 45)
    return ARCHETYPES.find((a) => a.id === 'budget-beaver')!

  // Chaos Rodent: mediocre across all, no standout
  if (maxVal < 65 && maxVal - minVal <= 20)
    return ARCHETYPES.find((a) => a.id === 'chaos-rodent')!

  // ── COMMON ──────────────────────────────────────────────────────────────
  // Lumber Loader: OCC is top AND high enough AND moderate burnout
  if (topDim === 'occupational' && OCC >= 65 && BURN >= 30 && BURN <= 65)
    return ARCHETYPES.find((a) => a.id === 'lumber-loader')!

  // Snack Breaker: PHY is top AND low burnout
  if (topDim === 'physical' && BURN <= 30)
    return ARCHETYPES.find((a) => a.id === 'snack-breaker')!

  // Campfire Buddy: SOC is top AND social + emotional thresholds
  if (topDim === 'social' && SOC >= 65 && EMO >= 45)
    return ARCHETYPES.find((a) => a.id === 'campfire-buddy')!

  // Hibernator: physically healthy but not working
  if (PHY >= 70 && OCC <= 40)
    return ARCHETYPES.find((a) => a.id === 'hibernator')!

  // Lo-fi Listener: emotional lead + partial social + not overworked
  if (EMO >= 65 && SOC >= 40 && SOC <= 70 && OCC <= 70)
    return ARCHETYPES.find((a) => a.id === 'lofi-listener')!

  // Cozy Builder: ENV is top AND high
  if (topDim === 'environmental' && ENV >= 65)
    return ARCHETYPES.find((a) => a.id === 'cozy-builder')!

  // Fallback: match by top dimension
  const fallbacks: Partial<Record<Dimension, string>> = {
    occupational: 'lumber-loader',
    physical: 'snack-breaker',
    social: 'campfire-buddy',
    emotional: 'lofi-listener',
    environmental: 'cozy-builder',
    intellectual: 'blueprint-brain',
    spiritual: 'cosmic-beaver',
    financial: 'budget-beaver',
  }
  return ARCHETYPES.find((a) => a.id === (fallbacks[topDim] ?? 'lumber-loader'))!
}

export function buildResult(answers: SurveyAnswer[]): Omit<SurveyResult, 'sessionId' | 'completedAt'> {
  const rawScores = calculateRawScores(answers)
  const normalizedScores = normalizeScores(rawScores)
  const archetype = selectArchetype(normalizedScores)
  return { rawScores, normalizedScores, archetype }
}
