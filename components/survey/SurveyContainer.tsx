'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Choice, Lang, SurveyAnswer, SurveyResult } from '@/types/survey'
import { QUESTIONS } from '@/data/questions'
import ProgressBar from './ProgressBar'
import SceneCard from './SceneCard'

type Phase = 'survey' | 'loading' | 'result'

interface Props {
  phase: Phase
  onPhaseChange: (phase: Phase) => void
  onResult: (result: SurveyResult) => void
  lang: Lang
}

// Rain drop component rendered as pure DOM for performance
function RainOverlay() {
  const drops = useRef(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      height: 40 + Math.random() * 60,
      duration: 0.8 + Math.random() * 0.8,
      delay: Math.random() * 2,
    }))
  ).current

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(100,150,200,0.06) 0%, rgba(60,110,170,0.12) 100%)' }} />
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="rain-drop"
          style={{
            left: `${drop.left}%`,
            height: `${drop.height}px`,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function SurveyContainer({ phase, onPhaseChange, onResult, lang }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<SurveyAnswer[]>([])

  const showRain = currentIndex >= Math.floor(QUESTIONS.length * 0.6)

  const handleAnswer = useCallback(
    async (choice: Choice) => {
      const question = QUESTIONS[currentIndex]
      const newAnswer: SurveyAnswer = {
        questionId: question.id,
        choiceId: choice.id,
        scores: choice.scores,
      }
      const newAnswers = [...answers, newAnswer]
      setAnswers(newAnswers)

      const isLast = currentIndex === QUESTIONS.length - 1

      if (isLast) {
        onPhaseChange('loading')
        try {
          const res = await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers: newAnswers }),
          })
          const data = await res.json()
          onResult(data)
        } catch {
          const { buildResult } = await import('@/lib/scoring')
          const resultData = buildResult(newAnswers)
          const sessionId = crypto.randomUUID()
          onResult({
            ...resultData,
            sessionId,
            completedAt: new Date().toISOString(),
          })
        }
      } else {
        setTimeout(() => setCurrentIndex((i) => i + 1), 400)
      }
    },
    [answers, currentIndex, onPhaseChange, onResult]
  )

  if (phase !== 'survey') return null

  const question = QUESTIONS[currentIndex]

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: 'var(--bg-primary)' }}>
      {showRain && <RainOverlay />}
      <div className="relative z-10 flex flex-col flex-1">
        <ProgressBar current={currentIndex + 1} total={QUESTIONS.length} lang={lang} />
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            <SceneCard
              key={question.id}
              question={question}
              onAnswer={handleAnswer}
              lang={lang}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
