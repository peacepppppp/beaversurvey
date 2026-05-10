'use client'

import { motion } from 'framer-motion'
import { Lang } from '@/types/survey'

interface Props {
  current: number
  total: number
  sceneName: string
  sceneNameEn: string
  lang: Lang
}

export default function ProgressBar({ current, total, sceneName, sceneNameEn, lang }: Props) {
  const pct = (current / total) * 100

  return (
    <div className="w-full px-5 pt-5 pb-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs thai-text font-medium" style={{ color: 'var(--accent-brown)' }}>
          {lang === 'th' ? sceneName : sceneNameEn}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {current} / {total}
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-card)' }}>
        <motion.div
          className="h-full rounded-full progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
