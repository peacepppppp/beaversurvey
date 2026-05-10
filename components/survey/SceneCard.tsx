'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lang, Question, Choice } from '@/types/survey'
import ChoiceButton from './ChoiceButton'

interface Props {
  question: Question
  onAnswer: (choice: Choice) => void
  lang: Lang
}

const TIME_LABELS = {
  th: {
    morning: '🌅 ช่วงเช้า',
    midday: '☀️ ช่วงสาย',
    afternoon: '🌤️ ช่วงบ่าย',
    evening: '🌆 ช่วงเย็น',
    night: '🌙 ช่วงกลางคืน',
  },
  en: {
    morning: '🌅 Morning',
    midday: '☀️ Midday',
    afternoon: '🌤️ Afternoon',
    evening: '🌆 Evening',
    night: '🌙 Night',
  },
}

export default function SceneCard({ question, onAnswer, lang }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const scene = lang === 'en' && question.sceneEn ? question.sceneEn : question.scene
  const questionText = lang === 'en' && question.questionEn ? question.questionEn : question.question
  const contextText = lang === 'en' && question.contextEn ? question.contextEn : question.context

  function handleChoice(choice: Choice) {
    if (isTransitioning || selected) return
    setSelected(choice.id)
    setIsTransitioning(true)
    setTimeout(() => {
      onAnswer(choice)
    }, 600)
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col gap-4 pb-6"
    >
      {/* Scene label */}
      <div className="flex items-center gap-2 px-5 pt-2">
        <span className="text-xs thai-text" style={{ color: 'var(--text-muted)' }}>
          {TIME_LABELS[lang][question.timeOfDay]}
        </span>
        <span style={{ color: 'var(--text-muted)' }}>·</span>
        <span className="text-xs thai-text" style={{ color: 'var(--text-muted)' }}>
          {scene}
        </span>
      </div>

      {/* Question card */}
      <div className="mx-5 cozy-card rounded-2xl p-5">
        <motion.div
          className="text-4xl mb-3 text-center"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {question.sceneEmoji}
        </motion.div>

        <h2
          className="text-base font-semibold text-center leading-relaxed thai-text mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {questionText}
        </h2>

        <p
          className="text-xs text-center leading-relaxed thai-text"
          style={{ color: 'var(--text-muted)' }}
        >
          {contextText}
        </p>
      </div>

      {/* Choices */}
      <div className="px-5 space-y-2.5">
        <AnimatePresence>
          {question.choices.map((choice, i) => (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              selected={selected === choice.id}
              onClick={() => handleChoice(choice)}
              index={i}
              lang={lang}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
