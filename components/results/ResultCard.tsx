'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lang, SurveyAnswer, SurveyResult } from '@/types/survey'
import { getFriendArchetype } from '@/data/archetypes'
import ShareButton from './ShareButton'

const GAS_URL =
  'https://script.google.com/macros/s/AKfycby6RocwXHu1EnXRgrv8uF7udfP9QX-ty_tQPsHWBD7gTRhJr6NxXP6pzNm0qOwjjne23Q/exec'

interface Props {
  result: SurveyResult
  answers: SurveyAnswer[]
  onRetake: () => void
  lang: Lang
}

type SubmitStatus = 'sending' | 'success' | 'failed'

// ── Rarity config ──────────────────────────────────────────────────────────
const RARITY_CONFIG = {
  common:    { badge: '🌱 Common',    badgeTh: '🌱 ทั่วไป',       particles: ['🍃', '🌿', '🌱'] },
  rare:      { badge: '💎 Rare',      badgeTh: '💎 หายาก',        particles: ['💧', '🌊', '✦'] },
  legendary: { badge: '✨ Legendary', badgeTh: '✨ Legendary',     particles: ['✨', '⭐', '🌟'] },
}

// ── Typewriter hook ────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 60, delay = 800) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, speed, delay])

  return { displayed, done }
}

// ── Particles ──────────────────────────────────────────────────────────────
function Particles({ rarity }: { rarity: 'common' | 'rare' | 'legendary' }) {
  const emojis = RARITY_CONFIG[rarity].particles
  const particles = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      x: 10 + Math.random() * 80,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2,
    }))
  ).current

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bottom-0 text-xl"
          style={{ left: `${p.x}%` }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -window.innerHeight * 0.9, opacity: [0, 1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  )
}

// ── GAS submission ─────────────────────────────────────────────────────────
function buildPayload(result: SurveyResult, answers: SurveyAnswer[]) {
  const s = result.normalizedScores
  const a = result.archetype
  const qAnswers: Record<string, string> = {}
  answers.forEach((ans, i) => { qAnswers[`q${i + 1}`] = ans.choiceId })

  return {
    user_id: result.sessionId,
    ...qAnswers,
    soc_score: s.social, occ_score: s.occupational, int_score: s.intellectual,
    env_score: s.environmental, spi_score: s.spiritual, fin_score: s.financial,
    emo_score: s.emotional, phy_score: s.physical, storm_level: s.burnout,
    beaver_type: a.name, beaver_type_en: a.nameEn, rarity: a.rarity,
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

async function submitWithRetry(payload: object, maxRetries = 3): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await fetch(GAS_URL, { method: 'POST', body: JSON.stringify(payload) })
      return true
    } catch {
      if (i < maxRetries - 1) await new Promise((r) => setTimeout(r, 2000))
    }
  }
  return false
}

// ── Status banner ──────────────────────────────────────────────────────────
function StatusBanner({ status }: { status: SubmitStatus }) {
  const text = {
    sending: 'กำลังส่งข้อมูลกลับสู่อาณานิคม...',
    success: 'อาณานิคมได้บันทึกเส้นทางของคุณแล้ว ✓',
    failed: 'สัญญาณจากเขื่อนขาดหาย ✕',
  }
  const bg = status === 'success' ? '#D1FAE5' : status === 'failed' ? '#FEE2E2' : '#FEF3E0'
  const color = status === 'success' ? '#065F46' : status === 'failed' ? '#991B1B' : '#92400E'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full shadow-lg text-xs thai-text font-medium flex items-center gap-2"
      style={{ background: bg, color, maxWidth: '90vw' }}
    >
      {status === 'sending' && (
        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>🌀</motion.span>
      )}
      {text[status]}
    </motion.div>
  )
}

// ── IG Story export ────────────────────────────────────────────────────────
async function exportStoryImage(cardRef: React.RefObject<HTMLDivElement | null>): Promise<void> {
  if (!cardRef.current) return
  const html2canvas = (await import('html2canvas')).default
  const canvas = await html2canvas(cardRef.current, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#FDFAF4',
  })
  const link = document.createElement('a')
  link.download = 'beaver-result.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

// ── Stress meter ───────────────────────────────────────────────────────────
function StressMeter({ level, label }: { level: number; label: string }) {
  const emoji = level <= 3 ? '😌' : level <= 6 ? '😅' : level <= 8 ? '😰' : '😵'
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          ระดับความเครียดในอาณานิคม
        </span>
        <span className="text-base">{emoji}</span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-card)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{
            background: level <= 4
              ? 'linear-gradient(90deg, #6B9E5E, #A0C878)'
              : level <= 7
              ? 'linear-gradient(90deg, #C17F24, #E07A3A)'
              : 'linear-gradient(90deg, #DC2626, #FF6B6B)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${level * 10}%` }}
          transition={{ delay: 1.4, duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs mt-1 thai-text" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function ResultCard({ result, answers, onRetake, lang }: Props) {
  const { archetype, normalizedScores } = result
  const [revealed, setRevealed] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('sending')
  const [showBanner, setShowBanner] = useState(true)
  const submitted = useRef(false)
  const storyCardRef = useRef<HTMLDivElement>(null)

  const name = lang === 'th' ? archetype.name : archetype.nameEn
  const { displayed: typedName, done: typewriterDone } = useTypewriter(name, 70, 600)

  const friendArchetype = getFriendArchetype(archetype)
  const rarityConfig = RARITY_CONFIG[archetype.rarity]

  // Reveal sequence
  useEffect(() => {
    const t = setTimeout(() => {
      setRevealed(true)
      setTimeout(() => setShowParticles(true), 400)
    }, 300)
    return () => clearTimeout(t)
  }, [])

  // GAS submission
  useEffect(() => {
    if (submitted.current) return
    submitted.current = true
    submitWithRetry(buildPayload(result, answers)).then((ok) => {
      setSubmitStatus(ok ? 'success' : 'failed')
      if (ok) setTimeout(() => setShowBanner(false), 3000)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const topDims = (Object.keys(normalizedScores) as (keyof typeof normalizedScores)[])
    .filter((d) => d !== 'burnout')
    .sort((a, b) => normalizedScores[b] - normalizedScores[a])
    .slice(0, 4)

  const DIM_LABELS: Record<string, { th: string; en: string; emoji: string }> = {
    social:       { th: 'สังคม',       en: 'Social',       emoji: '🤝' },
    occupational: { th: 'การงาน',      en: 'Work',         emoji: '🪵' },
    intellectual: { th: 'สติปัญญา',   en: 'Intellect',    emoji: '🧠' },
    environmental:{ th: 'สิ่งแวดล้อม', en: 'Environment',  emoji: '🌿' },
    spiritual:    { th: 'จิตวิญญาณ',  en: 'Spiritual',    emoji: '🌌' },
    financial:    { th: 'การเงิน',     en: 'Financial',    emoji: '🪙' },
    emotional:    { th: 'อารมณ์',      en: 'Emotional',    emoji: '💜' },
    physical:     { th: 'ร่างกาย',     en: 'Physical',     emoji: '⚡' },
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center px-5 py-8 pb-28"
      style={{ background: 'var(--bg-primary)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Particles on reveal */}
      {showParticles && <Particles rarity={archetype.rarity} />}

      {/* ── Story card (hidden, for IG export) ── */}
      <div className="fixed -left-[9999px] top-0 w-[540px] h-[960px] overflow-hidden" aria-hidden>
        <div
          ref={storyCardRef}
          className="w-full h-full flex flex-col items-center justify-center p-10 text-center"
          style={{ background: 'linear-gradient(160deg, #FDFAF4 0%, #F0E8D8 100%)' }}
        >
          <div className="text-8xl mb-4">{archetype.emoji}</div>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            BEAVER WORKER PROJECT
          </p>
          <h2 className="text-3xl font-bold mb-1 thai-text" style={{ color: 'var(--text-primary)' }}>
            {lang === 'th' ? archetype.name : archetype.nameEn}
          </h2>
          <p className="text-sm italic mb-4 thai-text" style={{ color: archetype.color }}>
            &ldquo;{lang === 'th' ? archetype.quote : archetype.quoteEn}&rdquo;
          </p>
          <span
            className="text-xs px-3 py-1 rounded-full font-medium mb-6"
            style={{ background: `${archetype.color}20`, color: archetype.color, border: `1px solid ${archetype.color}40` }}
          >
            {lang === 'th' ? rarityConfig.badgeTh : rarityConfig.badge}
          </span>
          <p className="text-xs mt-auto" style={{ color: 'var(--text-muted)' }}>
            คุณเป็นบีเวอร์แบบไหน? → beaversurvey.vercel.app
          </p>
        </div>
      </div>

      {/* ── RESULT REVEAL ── */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center"
            style={{ background: 'var(--bg-primary)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-6xl"
            >
              🦫
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <motion.p
        className="text-xs mb-4 thai-text font-medium uppercase tracking-widest"
        style={{ color: 'var(--text-muted)' }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        🦫 {lang === 'th' ? 'คุณคือ...' : 'You are...'}
      </motion.p>

      {/* ── Main archetype card ── */}
      <motion.div
        className="w-full max-w-sm rounded-3xl overflow-hidden mb-5 relative"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 18 }}
        style={{
          background: `linear-gradient(145deg, ${archetype.color}18, ${archetype.color}06)`,
          border: `1.5px solid ${archetype.color}30`,
          boxShadow: `0 8px 32px ${archetype.color}20`,
        }}
      >
        <div className="absolute inset-0 opacity-10 blur-3xl pointer-events-none" style={{ background: archetype.color }} />
        <div className="relative p-7 text-center">
          {/* Rarity badge — label only, no % */}
          <motion.span
            className="inline-block text-xs px-3 py-1 rounded-full font-semibold mb-4"
            style={{ background: `${archetype.color}18`, color: archetype.color, border: `1px solid ${archetype.color}30` }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            {lang === 'th' ? rarityConfig.badgeTh : rarityConfig.badge}
          </motion.span>

          {/* Emoji */}
          <motion.div
            className="text-7xl mb-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {archetype.emoji}
          </motion.div>

          {/* Typewriter name */}
          <h1 className="text-2xl font-bold mb-1 thai-text min-h-[2rem]" style={{ color: 'var(--text-primary)' }}>
            {typedName}
            {!typewriterDone && <span className="animate-pulse">|</span>}
          </h1>

          {/* Quote */}
          <AnimatePresence>
            {typewriterDone && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium mb-3 thai-text italic"
                style={{ color: archetype.color }}
              >
                &ldquo;{lang === 'th' ? archetype.quote : archetype.quoteEn}&rdquo;
              </motion.p>
            )}
          </AnimatePresence>

          {/* Description */}
          <motion.p
            className="text-sm leading-relaxed thai-text"
            style={{ color: 'var(--text-secondary)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            {lang === 'th' ? archetype.description : archetype.descriptionEn}
          </motion.p>
        </div>
      </motion.div>

      {/* ── Traits ── */}
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
          {(lang === 'th' ? archetype.traits : archetype.traitsEn).map((trait, i) => (
            <motion.span
              key={i}
              className="text-xs px-3 py-1.5 rounded-full thai-text font-medium"
              style={{ background: `${archetype.color}12`, color: archetype.color, border: `1px solid ${archetype.color}25` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 + i * 0.07 }}
            >
              {trait}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* ── Stress level ── */}
      <motion.div
        className="w-full max-w-sm cozy-card rounded-2xl p-5 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <StressMeter level={archetype.stressLevel} label={archetype.stressLabel} />
      </motion.div>

      {/* ── Dimension bars ── */}
      <motion.div
        className="w-full max-w-sm cozy-card rounded-2xl p-5 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05 }}
      >
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
          {lang === 'th' ? 'คะแนนมิติชีวิต' : 'Life Dimension Scores'}
        </h3>
        <div className="space-y-3">
          {topDims.map((dim, i) => {
            const d = DIM_LABELS[dim]
            return (
              <motion.div key={dim} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 + i * 0.08 }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs thai-text" style={{ color: 'var(--text-secondary)' }}>
                    {d.emoji} {lang === 'th' ? d.th : d.en}
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
            )
          })}
        </div>
      </motion.div>

      {/* ── HRD Activities ── */}
      <motion.div
        className="w-full max-w-sm cozy-card rounded-2xl p-5 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          {lang === 'th' ? 'กิจกรรมที่บีเวอร์แบบคุณน่าลอง 🏕️' : 'HRD Activities For You 🏕️'}
        </h3>
        <div className="space-y-2.5">
          {archetype.hrdActivities.map((act, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              className="rounded-xl p-3.5 flex flex-col gap-0.5"
              style={{ background: `${archetype.color}0E`, border: `1px solid ${archetype.color}20` }}
            >
              <span className="text-xs font-semibold thai-text" style={{ color: archetype.color }}>
                {act.name}
              </span>
              <span className="text-xs thai-text leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {act.description}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Friend Beaver ── */}
      {friendArchetype && (
        <motion.div
          className="w-full max-w-sm cozy-card rounded-2xl p-5 mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            {lang === 'th' ? 'บีเวอร์คู่หูของคุณ 🦫' : 'Your Beaver Buddy 🦫'}
          </h3>
          <div
            className="rounded-xl p-4 flex items-center gap-4"
            style={{ background: `${friendArchetype.color}0E`, border: `1px solid ${friendArchetype.color}25` }}
          >
            <span className="text-4xl">{friendArchetype.emoji}</span>
            <div>
              <p className="text-sm font-bold thai-text" style={{ color: 'var(--text-primary)' }}>
                {lang === 'th' ? friendArchetype.name : friendArchetype.nameEn}
              </p>
              <p className="text-xs thai-text mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'th' ? friendArchetype.tagline : friendArchetype.taglineEn}
              </p>
              <span
                className="inline-block text-xs mt-1.5 px-2 py-0.5 rounded-full"
                style={{ background: `${friendArchetype.color}18`, color: friendArchetype.color, fontSize: '10px' }}
              >
                {lang === 'th'
                  ? RARITY_CONFIG[friendArchetype.rarity].badgeTh
                  : RARITY_CONFIG[friendArchetype.rarity].badge}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Actions ── */}
      <motion.div
        className="w-full max-w-sm space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
      >
        <ShareButton archetype={archetype} lang={lang} />

        {/* IG Story export */}
        <button
          onClick={() => exportStoryImage(storyCardRef)}
          className="w-full py-3 rounded-xl text-sm font-medium thai-text cozy-card flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
          style={{ color: 'var(--text-secondary)' }}
        >
          📸 {lang === 'th' ? 'บันทึกรูป IG Story' : 'Save IG Story Image'}
        </button>

        <button
          onClick={onRetake}
          className="w-full py-3 rounded-xl text-sm cozy-card thai-text hover:opacity-80 transition-opacity"
          style={{ color: 'var(--text-muted)' }}
        >
          {lang === 'th' ? 'ลองใหม่อีกครั้ง ↺' : 'Try again ↺'}
        </button>
      </motion.div>

      {/* ── Status banner ── */}
      <AnimatePresence>
        {showBanner && <StatusBanner status={submitStatus} />}
      </AnimatePresence>
    </motion.div>
  )
}
