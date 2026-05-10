'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lang } from '@/types/survey'

interface Props {
  onStart: (lang: Lang, isKKU: boolean) => void
}

type Step = 'welcome' | 'kku' | 'story'

const T = {
  th: {
    title: 'คุณเป็นบีเวอร์แบบไหน?',
    subtitle: 'Beaver Worker Project',
    langBtn: 'ENG',
    welcomeDesc: 'อาณานิคมบีเวอร์กำลังเผชิญกับฤดูฝน\nคุณจะรับมือแบบไหน?',
    continue: 'ถัดไป →',
    kkuQuestion: 'คุณกำลังศึกษาอยู่ในคณะแพทยศาสตร์ มหาวิทยาลัยขอนแก่น หรือไม่?',
    kkuYes: '✓  ใช่ ฉันเป็นนักศึกษาแพทย์ มข.',
    kkuNo: '✗  ไม่ใช่',
    storyTitle: 'ฤดูฝนกำลังจะมา',
    storyLines: [
      'อาณานิคมบีเวอร์ต้องรีบสร้างเขื่อนให้เสร็จภายใน 7 วัน',
      'แต่บีเวอร์แต่ละตัว...',
      'ใช้ชีวิตต่างกัน  พักต่างกัน  เข้าหาเพื่อนฝูงต่างกัน',
      'และสนใจกิจกรรมต่างกัน',
    ],
    storyQuestion: 'แล้วคุณล่ะ…\nเป็นบีเวอร์แบบไหนในอาณานิคมนี้?',
    startBtn: 'ค้นหาบีเวอร์ในตัวคุณ →',
    hint: 'ใช้เวลาแค่ 3–5 นาที · ไม่มีการเก็บข้อมูลส่วนตัว',
    types: ['16 ประเภทบีเวอร์', '25 สถานการณ์', 'ผลลัพธ์ personalized'],
  },
  en: {
    title: 'Which Beaver Are You?',
    subtitle: 'Beaver Worker Project',
    langBtn: 'ภาษาไทย',
    welcomeDesc: 'The beaver colony faces the rainy season.\nHow will you handle it?',
    continue: 'Next →',
    kkuQuestion: 'Are you currently a medical student at Khon Kaen University?',
    kkuYes: '✓  Yes, I study medicine at KKU',
    kkuNo: '✗  No',
    storyTitle: 'The Rainy Season Is Coming',
    storyLines: [
      'The beaver colony must finish the dam within 7 days.',
      'But every beaver...',
      'Lives differently  ·  Rests differently  ·  Connects differently',
      'And cares about different things.',
    ],
    storyQuestion: 'So which beaver are you\nin this colony?',
    startBtn: 'Find Your Inner Beaver →',
    hint: 'Only 3–5 min · No personal data collected',
    types: ['16 Beaver Types', '25 Situations', 'Personalized Result'],
  },
}

export default function OnboardingScreen({ onStart }: Props) {
  const [lang, setLang] = useState<Lang>('th')
  const [step, setStep] = useState<Step>('welcome')
  const [isKKU, setIsKKU] = useState<boolean | null>(null)

  const t = T[lang]

  function handleKKU(val: boolean) {
    setIsKKU(val)
    setStep('story')
  }

  function handleStart() {
    onStart(lang, isKKU ?? false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-5 py-10"
    >
      {/* Lang toggle */}
      <div className="absolute top-5 right-5">
        <button
          onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
          className="text-xs px-3 py-1.5 rounded-full border font-medium transition-colors"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
            background: 'white',
          }}
        >
          {t.langBtn}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ── STEP: WELCOME ─────────────────────────────────────────────── */}
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm flex flex-col items-center text-center"
          >
            {/* Beaver emoji */}
            <motion.div
              className="text-7xl mb-5"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              🦫
            </motion.div>

            {/* Titles */}
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {t.subtitle}
            </p>
            <h1
              className="text-3xl font-bold mb-4 thai-text"
              style={{ color: 'var(--text-primary)' }}
            >
              {t.title}
            </h1>

            <p
              className="text-sm leading-relaxed thai-text mb-8 whitespace-pre-line"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t.welcomeDesc}
            </p>

            {/* Stats row */}
            <div className="flex gap-3 mb-8 w-full">
              {t.types.map((label) => (
                <div
                  key={label}
                  className="flex-1 py-3 rounded-xl text-center"
                  style={{ background: '#FEF6E8', border: '1px solid var(--border-card)' }}
                >
                  <p
                    className="text-xs font-medium thai-text leading-snug"
                    style={{ color: 'var(--accent-brown)' }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('kku')}
              className="w-full py-4 rounded-2xl font-semibold text-base text-white"
              style={{ background: 'linear-gradient(135deg, #8B6347, #C17F24)' }}
            >
              {t.continue}
            </button>
          </motion.div>
        )}

        {/* ── STEP: KKU QUESTION ────────────────────────────────────────── */}
        {step === 'kku' && (
          <motion.div
            key="kku"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm flex flex-col items-center text-center"
          >
            <div className="text-5xl mb-6">🏥</div>

            <h2
              className="text-lg font-semibold leading-relaxed thai-text mb-8"
              style={{ color: 'var(--text-primary)' }}
            >
              {t.kkuQuestion}
            </h2>

            <div className="w-full space-y-3">
              <button
                onClick={() => handleKKU(true)}
                className="w-full py-4 px-5 rounded-2xl text-sm font-medium text-left thai-text transition-all hover:shadow-md"
                style={{
                  background: 'white',
                  border: '1.5px solid var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                {t.kkuYes}
              </button>
              <button
                onClick={() => handleKKU(false)}
                className="w-full py-4 px-5 rounded-2xl text-sm font-medium text-left thai-text transition-all hover:shadow-md"
                style={{
                  background: 'white',
                  border: '1.5px solid var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                {t.kkuNo}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP: STORY ───────────────────────────────────────────────── */}
        {step === 'story' && (
          <motion.div
            key="story"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm flex flex-col items-center text-center"
          >
            <div className="text-5xl mb-5">🌧️</div>

            <h2
              className="text-xl font-bold mb-6 thai-text"
              style={{ color: 'var(--text-primary)' }}
            >
              {t.storyTitle}
            </h2>

            {/* Story card */}
            <div
              className="w-full rounded-2xl p-6 mb-6 text-left space-y-3"
              style={{ background: '#FEF6E8', border: '1px solid var(--border-card)' }}
            >
              {t.storyLines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.12 }}
                  className="text-sm thai-text"
                  style={{ color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                  {i === 0 ? <strong>{line}</strong> : line}
                </motion.p>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="pt-3 border-t"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <p
                  className="text-base font-semibold thai-text whitespace-pre-line leading-relaxed"
                  style={{ color: 'var(--accent-brown)' }}
                >
                  {t.storyQuestion}
                </p>
              </motion.div>
            </div>

            <motion.button
              onClick={handleStart}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="w-full py-4 rounded-2xl font-semibold text-base text-white mb-3"
              style={{ background: 'linear-gradient(135deg, #8B6347, #C17F24)' }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
            >
              {t.startBtn}
            </motion.button>

            <p className="text-xs thai-text" style={{ color: 'var(--text-muted)' }}>
              {t.hint}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
