'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SurveyResult, SurveyAnswer } from '@/types/survey'
import { activitiesByDimension } from '@/data/activities'

interface Props {
  result: SurveyResult
  answers: SurveyAnswer[]
  onComplete: (updatedResult: SurveyResult) => void
  lang: 'th' | 'en'
}

export default function ActivitySelection({ result, answers, onComplete }: Props) {
  const topDim = (Object.keys(result.rawScores) as (keyof typeof result.rawScores)[])
    .filter((d) => d !== 'burnout')
    .sort((a, b) => result.rawScores[b] - result.rawScores[a])[0]

  const activities = (activitiesByDimension as any)[topDim] ?? []
  const [selected, setSelected] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const maxSel = 3

  function toggle(act: string) {
    if (selected.includes(act)) setSelected(selected.filter((s) => s !== act))
    else if (selected.length < maxSel) setSelected([...selected, act])
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, activities: selected, dimensionTotals: result.rawScores }),
      })
      const data = await res.json()
      // merge any returned fields into result
      onComplete({ ...result, sessionId: data.sessionId ?? result.sessionId, selectedActivities: selected })
    } catch (e) {
      // fallback: still proceed
      onComplete(result)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen p-6 flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Choose up to 3 activities</h2>
        <p className="text-sm text-muted">Activities suggested for your top wellness area: <strong>{topDim}</strong></p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {activities.map((act: string) => {
          const isSel = selected.includes(act)
          return (
            <motion.button
              key={act}
              onClick={() => toggle(act)}
              whileTap={{ scale: 0.98 }}
              className={`rounded-lg p-3 text-left shadow-sm border ${isSel ? 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white' : 'bg-white'} `}
              disabled={!isSel && selected.length >= maxSel}
            >
              <div className="text-sm font-medium">{act}</div>
              <div className="text-xs text-muted mt-1">{isSel ? 'Selected' : 'Tap to select'}</div>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-auto">
        <div className="mb-3 text-sm text-muted">Selected: {selected.length} / {maxSel}</div>
        <button
          className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold disabled:opacity-50"
          onClick={handleSubmit}
          disabled={selected.length === 0 || submitting}
        >
          {submitting ? 'Sending...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
