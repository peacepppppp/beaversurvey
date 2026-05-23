'use client'

import { useState, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Choice, Lang, SurveyAnswer, SurveyResult } from '@/types/survey'
import { QUESTIONS, SCENE_GROUPS, getSceneForIndex } from '@/data/questions'
import ProgressBar from './ProgressBar'
import SceneCard from './SceneCard'

type Phase = 'survey' | 'loading' | 'result'

interface Props {
  phase: Phase
  onPhaseChange: (phase: Phase) => void
  onResult: (result: SurveyResult, answers: SurveyAnswer[]) => void
  lang: Lang
}

// Rain drops — only rendered for Scene 5
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
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(100,150,200,0.06) 0%, rgba(60,110,170,0.12) 100%)' }}
      />
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

// Scene transition panel shown between scenes
function SceneTransition({
  scene,
  onDone,
}: {
  scene: { name: string; nameEn: string; emoji: string }
  lang: Lang
  onDone: () => void
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'var(--bg-primary)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => setTimeout(onDone, 900)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <div className="text-5xl mb-3">{scene.emoji}</div>
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
          ☁️ ย้ายฉากใหม่...
        </p>
        <p className="text-xl font-bold thai-text" style={{ color: 'var(--text-primary)' }}>
          {scene.name}
        </p>
      </motion.div>
    </motion.div>
  )
}

export default function SurveyContainer({ phase, onPhaseChange, onResult, lang }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<SurveyAnswer[]>([])
  const [transitioning, setTransitioning] = useState(false)
  const [pendingIndex, setPendingIndex] = useState<number | null>(null)
  const [beaverReaction, setBeaverReaction] = useState<string | null>(null)

  const currentScene = getSceneForIndex(currentIndex)
  const showRain = currentIndex >= 16 // Scene 5 starts at index 16

  const REACTIONS = ['🦫✨', '🦫💭', '🦫😌', '🦫🌿', '🦫⭐']

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

      // Beaver emoji micro-feedback
      const reaction = REACTIONS[Math.floor(Math.random() * REACTIONS.length)]
      setBeaverReaction(reaction)
      setTimeout(() => setBeaverReaction(null), 800)

      const isLast = currentIndex === QUESTIONS.length - 1
      const nextIndex = currentIndex + 1

      if (isLast) {
        // compute result locally and let parent route to activity selection
        const { buildResult } = await import('@/lib/scoring')
        const resultData = buildResult(newAnswers)
        onResult(
          { ...resultData, sessionId: crypto.randomUUID(), completedAt: new Date().toISOString() },
          newAnswers
        )
        return
      }

      // Check if next question is a new scene
      const currentSceneGroup = SCENE_GROUPS.find((g) => g.indices.includes(currentIndex))
      const nextSceneGroup = SCENE_GROUPS.find((g) => g.indices.includes(nextIndex))
      const isSceneChange = currentSceneGroup !== nextSceneGroup

      if (isSceneChange && nextSceneGroup) {
        setTimeout(() => {
          setTransitioning(true)
          setPendingIndex(nextIndex)
        }, 500)
      } else {
        setTimeout(() => setCurrentIndex(nextIndex), 400)
      }
    },
    [answers, currentIndex, onPhaseChange, onResult]
  )

  if (phase !== 'survey') return null

  const question = QUESTIONS[currentIndex]
  const transitionScene = pendingIndex !== null ? getSceneForIndex(pendingIndex) : null

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: 'var(--bg-primary)' }}>
      {showRain && <RainOverlay />}

      {/* Scene transition overlay */}
      <AnimatePresence>
        {transitioning && transitionScene && (
          <SceneTransition
            scene={transitionScene}
            lang={lang}
            onDone={() => {
              setCurrentIndex(pendingIndex!)
              setPendingIndex(null)
              setTransitioning(false)
            }}
          />
        )}
      </AnimatePresence>

      {/* Beaver reaction micro-feedback */}
      <AnimatePresence>
        {beaverReaction && (
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 text-3xl pointer-events-none"
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1.4, y: -30 }}
            exit={{ opacity: 0, scale: 0.8, y: -60 }}
            transition={{ duration: 0.4 }}
          >
            {beaverReaction}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col flex-1">
        <ProgressBar
          current={currentIndex + 1}
          total={QUESTIONS.length}
          sceneName={currentScene.name}
          sceneNameEn={currentScene.nameEn}
          lang={lang}
        />
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
