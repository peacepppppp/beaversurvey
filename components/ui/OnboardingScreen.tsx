'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Lang } from '@/types/survey'

interface Props {
  onStart: (lang: Lang) => void
}

type Step = 'title' | 'story' | 'gate'

const T = {
  th: {
    project: 'BEAVER WORKER PROJECT',
    title: 'คุณเป็นบีเวอร์แบบไหน?',
    langBtn: 'ENG',
    startBtn: 'เริ่มสำรวจอาณานิคม →',
    rain1: 'ฤดูฝนกำลังจะมา...',
    rain2: 'อาณานิคมบีเวอร์ต้องรีบสร้างเขื่อนให้เสร็จภายใน 7 วัน',
    rain3: 'แต่บีเวอร์แต่ละตัว:',
    rain4: 'ใช้ชีวิตต่างกัน  พักต่างกัน  เข้าหาเพื่อนฝูงต่างกัน',
    rain5: 'แล้วคุณล่ะ…',
    rain6: 'เป็นบีเวอร์แบบไหนในอาณานิคมนี้? 🦫',
    continueBtn: 'ค้นหาตัวเอง →',
    gatePrefix: 'ก่อนเข้าอาณานิคม ขอถามหน่อยนะ...',
    gateQ: 'คุณเป็นบีเวอร์ที่กำลังศึกษาอยู่ในคณะแพทยศาสตร์ มหาวิทยาลัยขอนแก่น หรือไม่?',
    gateYes: 'ใช่ 🦫',
    gateNo: 'ไม่ใช่',
    hint: 'ใช้เวลาแค่ 3–5 นาที · ไม่มีการเก็บข้อมูลส่วนตัว',
  },
  en: {
    project: 'BEAVER WORKER PROJECT',
    title: 'Which Beaver Are You?',
    langBtn: 'ภาษาไทย',
    startBtn: 'Enter the Colony →',
    rain1: 'The rainy season is coming...',
    rain2: 'The beaver colony must finish the dam within 7 days.',
    rain3: 'But every beaver:',
    rain4: 'Lives differently  ·  Rests differently  ·  Connects differently',
    rain5: 'So which one are you…',
    rain6: 'in this colony? 🦫',
    continueBtn: 'Find Yourself →',
    gatePrefix: 'Before entering the colony, one quick question...',
    gateQ: 'Are you currently a medical student at Khon Kaen University (KKU)?',
    gateYes: 'Yes 🦫',
    gateNo: 'No',
    hint: 'Takes only 3–5 min · No personal data collected',
  },
}

export default function OnboardingScreen({ onStart }: Props) {
  const [lang, setLang] = useState<Lang>('th')
  const [step, setStep] = useState<Step>('title')
  const router = useRouter()
  const t = T[lang]

  function handleGateYes() {
    onStart(lang)
  }

  function handleGateNo() {
    router.push('/not-eligible')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-5 py-10 relative"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Lang toggle */}
      <div className="absolute top-5 right-5">
        <button
          onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
          className="text-xs px-3 py-1.5 rounded-full border font-medium transition-colors"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'white' }}
        >
          {t.langBtn}
        </button>
      </div>

      <AnimatePresence mode="wait">

        {/* ── SCREEN 1: TITLE ──────────────────────────────────────────── */}
        {step === 'title' && (
          <motion.div
            key="title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm flex flex-col items-center text-center"
          >
            <motion.div
              className="text-7xl mb-5"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              🦫
            </motion.div>

            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {t.project}
            </p>

            <h1
              className="text-3xl font-bold mb-8 thai-text"
              style={{ color: 'var(--text-primary)' }}
            >
              {t.title}
            </h1>

            <button
              onClick={() => setStep('story')}
              className="w-full py-4 rounded-2xl font-semibold text-base text-white thai-text"
              style={{ background: 'linear-gradient(135deg, #8B6347, #C17F24)' }}
            >
              {t.startBtn}
            </button>

            <p className="text-xs mt-4 thai-text" style={{ color: 'var(--text-muted)' }}>
              {t.hint}
            </p>
          </motion.div>
        )}

        {/* ── SCREEN 2: STORY INTRO ────────────────────────────────────── */}
        {step === 'story' && (
          <motion.div
            key="story"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm flex flex-col items-center text-center"
          >
            {/* Rain drops visual */}
            <div className="text-4xl mb-6 space-x-1">
              {['🌧️', '🌧️', '🌧️'].map((r, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
                >
                  {r}
                </motion.span>
              ))}
            </div>

            <div
              className="w-full cozy-card rounded-2xl p-6 mb-6 text-left space-y-3"
            >
              {[t.rain1, t.rain2, t.rain3, t.rain4, t.rain5, t.rain6].map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.15 }}
                  className="text-sm thai-text leading-relaxed"
                  style={{
                    color: i === 0 || i === 4 ? 'var(--accent-brown)' : 'var(--text-secondary)',
                    fontWeight: i === 0 || i === 5 ? 600 : 400,
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </div>

            <motion.button
              onClick={() => setStep('gate')}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="w-full py-4 rounded-2xl font-semibold text-base text-white thai-text"
              style={{ background: 'linear-gradient(135deg, #8B6347, #C17F24)' }}
              whileTap={{ scale: 0.97 }}
            >
              {t.continueBtn}
            </motion.button>
          </motion.div>
        )}

        {/* ── SCREEN 3: KKU GATE ───────────────────────────────────────── */}
        {step === 'gate' && (
          <motion.div
            key="gate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm flex flex-col items-center text-center"
          >
            <div className="text-5xl mb-5">🏥</div>

            <p
              className="text-sm mb-3 thai-text"
              style={{ color: 'var(--text-muted)' }}
            >
              {t.gatePrefix}
            </p>

            <h2
              className="text-lg font-semibold leading-relaxed thai-text mb-8"
              style={{ color: 'var(--text-primary)' }}
            >
              {t.gateQ}
            </h2>

            <div className="w-full space-y-3">
              <motion.button
                onClick={handleGateYes}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl font-semibold text-white text-base thai-text"
                style={{ background: 'linear-gradient(135deg, #8B6347, #C17F24)' }}
              >
                {t.gateYes}
              </motion.button>

              <motion.button
                onClick={handleGateNo}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl text-sm thai-text cozy-card hover:opacity-80 transition-opacity"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t.gateNo}
              </motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  )
}
