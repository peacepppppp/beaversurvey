'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lang } from '@/types/survey'

const TEXTS = {
  th: [
    'กำลังวิเคราะห์รูปแบบการทำงาน...',
    'ตรวจสอบระดับพลังงานบีเวอร์...',
    'วัดระดับ burnout...',
    'ค้นหาอาณานิคมที่เหมาะกับคุณ...',
    'เกือบแล้ว...',
  ],
  en: [
    'Analyzing your work patterns...',
    'Checking beaver energy levels...',
    'Measuring burnout index...',
    'Finding your colony match...',
    'Almost there...',
  ],
}

interface Props {
  onComplete: () => void
  lang: Lang
}

export default function LoadingScreen({ onComplete, lang }: Props) {
  const [textIndex, setTextIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const texts = TEXTS[lang]

  useEffect(() => {
    const duration = 3200
    const steps = 60
    const interval = duration / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      setProgress(Math.min((step / steps) * 100, 100))
      setTextIndex(Math.min(Math.floor((step / steps) * texts.length), texts.length - 1))

      if (step >= steps) {
        clearInterval(timer)
        setTimeout(onComplete, 300)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete, texts.length])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-6"
    >
      {/* Spinning rings around beaver */}
      <div className="relative w-36 h-36 mb-10">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#C17F24', borderRightColor: '#8B6347' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-3 rounded-full border-2 border-transparent"
          style={{ borderBottomColor: '#D4945A', borderLeftColor: '#A0785A' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-5xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🦫
          </motion.span>
        </div>
      </div>

      {/* Loading text */}
      <div className="h-8 mb-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={textIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-base font-medium thai-text text-center"
            style={{ color: 'var(--text-secondary)' }}
          >
            {texts[textIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div
        className="w-64 h-1.5 rounded-full overflow-hidden"
        style={{ background: 'var(--border-card)' }}
      >
        <motion.div
          className="h-full rounded-full progress-fill"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <p
        className="text-xs mt-3 thai-text"
        style={{ color: 'var(--text-muted)' }}
      >
        {Math.round(progress)}%
      </p>
    </motion.div>
  )
}
