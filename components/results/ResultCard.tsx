'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lang, SurveyAnswer, SurveyResult } from '@/types/survey'
import ShareButton from './ShareButton'

const GAS_URL =
  'https://script.google.com/macros/s/AKfycby6RocwXHu1EnXRgrv8uF7udfP9QX-ty_tQPsHWBD7gTRhJr6NxXP6pzNm0qOwjjne23Q/exec'

interface Props {
  result: SurveyResult
  answers: SurveyAnswer[]
  onRetake: () => void
  lang: Lang
  isKKU: boolean
}

type SubmitStatus = 'sending' | 'success' | 'failed'

const RARITY_LABELS = {
  th: { common: 'ทั่วไป', rare: 'หายาก ✦', 'super-rare': 'หายากมาก ✦✦✦' },
  en: { common: 'Common', rare: 'Rare ✦', 'super-rare': 'Super Rare ✦✦✦' },
}

const DIM_LABELS = {
  th: {
    social: 'สังคม', occupational: 'การงาน', intellectual: 'สติปัญญา',
    environmental: 'สิ่งแวดล้อม', spiritual: 'จิตวิญญาณ', financial: 'การเงิน',
    emotional: 'อารมณ์', physical: 'ร่างกาย', burnout: 'Burnout',
  },
  en: {
    social: 'Social', occupational: 'Work', intellectual: 'Intellect',
    environmental: 'Environment', spiritual: 'Spiritual', financial: 'Financial',
    emotional: 'Emotional', physical: 'Physical', burnout: 'Burnout',
  },
}

const DIM_EMOJIS: Record<string, string> = {
  social: '🤝', occupational: '🪵', intellectual: '🧠', environmental: '🌿',
  spiritual: '🌌', financial: '🪙', emotional: '💜', physical: '⚡', burnout: '🔥',
}

// ── GAS submission ──────────────────────────────────────────────────────────

function buildPayload(result: SurveyResult, answers: SurveyAnswer[]) {
  const s = result.normalizedScores
  const a = result.archetype

  // Individual answers: q1…q20
  const questionAnswers: Record<string, string> = {}
  answers.forEach((ans, i) => {
    questionAnswers[`q${i + 1}`] = ans.choiceId
  })

  return {
    user_id: result.sessionId,
    ...questionAnswers,
    // Wellness scores
    soc_score: s.social,
    occ_score: s.occupational,
    int_score: s.intellectual,
    env_score: s.environmental,
    spi_score: s.spiritual,
    fin_score: s.financial,
    emo_score: s.emotional,
    phy_score: s.physical,
    // Storm level = burnout
    storm_level: s.burnout,
    // Beaver identity
    beaver_type: a.name,
    beaver_type_en: a.nameEn,
    rarity: a.rarity,
    // Skill scores derived from dimension combos
    lead_score: Math.round((s.occupational + s.social) / 2),
    team_score: s.social,
    comm_score: Math.round((s.social + s.emotional) / 2),
    crea_score: Math.round((s.intellectual + s.environmental) / 2),
    plan_score: Math.round((s.intellectual + s.financial) / 2),
    perf_score: s.occupational,
    care_score: s.emotional,
    strat_score: Math.round((s.intellectual + s.occupational) / 2),
    completed_at: result.completedAt,
  }
}

async function submitToSheets(payload: object): Promise<void> {
  console.log('[GAS] sending payload:', payload)
  const res = await fetch(GAS_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  console.log('[GAS] response:', text)
}

async function submitWithRetry(
  payload: object,
  onRetrying: () => void,
  maxRetries = 3,
): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await submitToSheets(payload)
      return true
    } catch {
      if (i < maxRetries - 1) {
        onRetrying()
        await new Promise((r) => setTimeout(r, 2000))
      }
    }
  }
  return false
}

// ── Status banner ───────────────────────────────────────────────────────────

const STATUS_TEXT = {
  sending:  'กำลังส่งข้อมูลกลับสู่อาณานิคม...',
  retrying: 'สัญญาณจากเขื่อนขาดหาย กำลังลองใหม่...',
  success:  'อาณานิคมได้บันทึกเส้นทางของคุณแล้ว',
  failed:   'สัญญาณจากเขื่อนขาดหาย',
}

function StatusBanner({ status }: { status: SubmitStatus }) {
  const [label, setLabel] = useState(STATUS_TEXT.sending)

  useEffect(() => {
    if (status === 'sending') setLabel(STATUS_TEXT.sending)
    if (status === 'success') setLabel(STATUS_TEXT.success)
    if (status === 'failed') setLabel(STATUS_TEXT.failed)
  }, [status])

  const bg =
    status === 'success' ? '#D1FAE5' :
    status === 'failed'  ? '#FEE2E2' :
    '#FEF3E0'

  const color =
    status === 'success' ? '#065F46' :
    status === 'failed'  ? '#991B1B' :
    '#92400E'

  const icon =
    status === 'success' ? '✓' :
    status === 'failed'  ? '✕' :
    '🦫'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-sm thai-text font-medium"
      style={{ background: bg, color, maxWidth: '90vw' }}
    >
      {status === 'sending' && (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'inline-block' }}
        >
          🌀
        </motion.span>
      )}
      {status !== 'sending' && <span>{icon}</span>}
      <span>{label}</span>
    </motion.div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export default function ResultCard({ result, answers, onRetake, lang }: Props) {
  const { archetype, normalizedScores } = result
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('sending')
  const [showBanner, setShowBanner] = useState(true)
  const submitted = useRef(false)

  // Submit to GAS once on mount
  useEffect(() => {
    if (submitted.current) return
    submitted.current = true

    const payload = buildPayload(result, answers)

    submitWithRetry(payload, () => setSubmitStatus('sending')).then((ok) => {
      setSubmitStatus(ok ? 'success' : 'failed')
      if (ok) setTimeout(() => setShowBanner(false), 3000)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const name        = lang === 'th' ? archetype.name        : archetype.nameEn
  const quote       = lang === 'th' ? archetype.quote       : archetype.quoteEn
  const tagline     = lang === 'th' ? archetype.tagline     : archetype.taglineEn
  const description = lang === 'th' ? archetype.description : archetype.descriptionEn
  const traits      = lang === 'th' ? archetype.traits      : archetype.traitsEn
  const rarityLabel = RARITY_LABELS[lang][archetype.rarity]
  const dimLabels   = DIM_LABELS[lang]

  const scoredDims = (Object.keys(normalizedScores) as (keyof typeof normalizedScores)[])
    .filter((d) => d !== 'burnout')
    .sort((a, b) => normalizedScores[b] - normalizedScores[a])
    .slice(0, 5)

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center px-5 py-8 pb-24"
      style={{ background: 'var(--bg-primary)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <motion.p
        className="text-sm mb-4 thai-text font-medium"
        style={{ color: 'var(--text-muted)' }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {lang === 'th' ? '🦫 คุณคือ...' : '🦫 You are...'}
      </motion.p>

      {/* Archetype card */}
      <motion.div
        className="w-full max-w-sm rounded-3xl overflow-hidden mb-6 relative"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 200, damping: 18 }}
        style={{
          background: `linear-gradient(145deg, ${archetype.color}18, ${archetype.color}08)`,
          border: `1.5px solid ${archetype.color}30`,
          boxShadow: `0 8px 32px ${archetype.color}20`,
        }}
      >
        <div className="absolute inset-0 opacity-10 blur-3xl pointer-events-none" style={{ background: archetype.color }} />

        <div className="relative p-7 text-center">
          <motion.span
            className={`inline-block text-xs px-3 py-1 rounded-full font-medium mb-4 ${
              archetype.rarity === 'super-rare' ? 'rarity-super-rare' :
              archetype.rarity === 'rare' ? 'rarity-rare' : 'rarity-common'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {rarityLabel}
          </motion.span>

          <motion.div
            className="text-7xl mb-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {archetype.emoji}
          </motion.div>

          <motion.h1
            className="text-2xl font-bold mb-1 thai-text"
            style={{ color: 'var(--text-primary)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {name}
          </motion.h1>

          <motion.p
            className="text-sm font-medium mb-2 thai-text italic"
            style={{ color: archetype.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            &ldquo;{quote}&rdquo;
          </motion.p>

          <motion.p
            className="text-xs mb-4 thai-text"
            style={{ color: 'var(--text-muted)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            {tagline}
          </motion.p>

          <motion.p
            className="text-sm leading-relaxed thai-text"
            style={{ color: 'var(--text-secondary)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {description}
          </motion.p>
        </div>
      </motion.div>

      {/* Traits */}
      <motion.div
        className="w-full max-w-sm cozy-card rounded-2xl p-5 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          {lang === 'th' ? 'นิสัยของคุณ' : 'Your Traits'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {traits.map((trait, i) => (
            <motion.span
              key={i}
              className="text-xs px-3 py-1.5 rounded-full thai-text font-medium"
              style={{ background: `${archetype.color}12`, color: archetype.color, border: `1px solid ${archetype.color}25` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 + i * 0.06 }}
            >
              {trait}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Dimension bars */}
      <motion.div
        className="w-full max-w-sm cozy-card rounded-2xl p-5 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
          {lang === 'th' ? 'คะแนนมิติชีวิต' : 'Life Dimension Scores'}
        </h3>
        <div className="space-y-3">
          {scoredDims.map((dim, i) => (
            <motion.div
              key={dim}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + i * 0.08 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs thai-text" style={{ color: 'var(--text-secondary)' }}>
                  {DIM_EMOJIS[dim]} {dimLabels[dim]}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{normalizedScores[dim]}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-card)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: archetype.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${normalizedScores[dim]}%` }}
                  transition={{ delay: 1.2 + i * 0.08, duration: 0.7, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Burnout */}
      <motion.div
        className="w-full max-w-sm cozy-card rounded-2xl p-5 mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            🔥 Burnout Index
          </span>
          <span className="text-xs" style={{ color: normalizedScores.burnout > 70 ? '#DC2626' : 'var(--text-muted)' }}>
            {normalizedScores.burnout}%
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-card)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{
              background: normalizedScores.burnout > 70
                ? 'linear-gradient(90deg, #F59E0B, #DC2626)'
                : 'linear-gradient(90deg, #6B9E5E, #C17F24)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${normalizedScores.burnout}%` }}
            transition={{ delay: 1.3, duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="w-full max-w-sm space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <ShareButton archetype={archetype} lang={lang} />
        <button
          onClick={onRetake}
          className="w-full py-3 rounded-xl text-sm cozy-card thai-text transition-colors hover:opacity-80"
          style={{ color: 'var(--text-secondary)' }}
        >
          {lang === 'th' ? 'ลองใหม่อีกครั้ง ↺' : 'Try again ↺'}
        </button>
      </motion.div>

      {/* Submission status banner */}
      <AnimatePresence>
        {showBanner && <StatusBanner status={submitStatus} />}
      </AnimatePresence>
    </motion.div>
  )
}
