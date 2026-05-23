'use client'

import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Lang, SurveyAnswer, SurveyResult } from '@/types/survey'
import OnboardingScreen from '@/components/ui/OnboardingScreen'
import LoadingScreen from '@/components/ui/LoadingScreen'
import SurveyContainer from '@/components/survey/SurveyContainer'
import ResultCard from '@/components/results/ResultCard'
import ActivitySelection from '@/components/results/ActivitySelection'

type Phase = 'onboarding' | 'survey' | 'activity' | 'loading' | 'result'

export default function Home() {
  const [phase, setPhase] = useState<Phase>('onboarding')
  const [surveyPhase, setSurveyPhase] = useState<'survey' | 'loading' | 'result'>('survey')
  const [result, setResult] = useState<SurveyResult | null>(null)
  const [answers, setAnswers] = useState<SurveyAnswer[]>([])
  const [lang, setLang] = useState<Lang>('th')

  const handleStart = useCallback((selectedLang: Lang) => {
    setLang(selectedLang)
    setPhase('survey')
    setSurveyPhase('survey')
  }, [])

  const handlePhaseChange = useCallback((p: 'survey' | 'loading' | 'result') => {
    setSurveyPhase(p)
    if (p === 'loading') setPhase('loading')
  }, [])

  const handleResult = useCallback((r: SurveyResult, a: SurveyAnswer[]) => {
    setResult(r)
    setAnswers(a)
    setPhase('activity')
    try {
      localStorage.setItem('beaversurvey_state', JSON.stringify({ result: r, answers: a, phase: 'activity', surveyPhase }))
    } catch (e) {}
  }, [])

  const handleLoadingComplete = useCallback(() => {
    setPhase('result')
  }, [])

  const handleRetake = useCallback(() => {
    setResult(null)
    setAnswers([])
    setPhase('onboarding')
    setSurveyPhase('survey')
    try {
      localStorage.removeItem('beaversurvey_state')
    } catch (e) {}
  }, [])

  // Restore saved state (if any)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('beaversurvey_state')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.result) {
          setResult(parsed.result)
          setAnswers(parsed.answers ?? [])
          setPhase(parsed.phase ?? 'result')
          setSurveyPhase(parsed.surveyPhase ?? 'result')
        }
      }
    } catch (e) {}
  }, [])

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {phase === 'onboarding' && (
          <OnboardingScreen key="onboarding" onStart={handleStart} />
        )}
        {phase === 'survey' && (
          <SurveyContainer
            key="survey"
            phase={surveyPhase}
            onPhaseChange={handlePhaseChange}
            onResult={handleResult}
            lang={lang}
          />
        )}
        {phase === 'activity' && result && (
          <ActivitySelection
            key="activity"
            result={result}
            answers={answers}
            onComplete={(updatedResult) => {
              setResult(updatedResult)
              setPhase('loading')
            }}
            lang={lang}
          />
        )}
        {phase === 'loading' && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} lang={lang} />
        )}
        {phase === 'result' && result && (
          <ResultCard
            key="result"
            result={result}
            answers={answers}
            onRetake={handleRetake}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
