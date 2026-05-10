'use client'

import { motion } from 'framer-motion'
import { Choice, Lang } from '@/types/survey'

interface Props {
  choice: Choice
  selected: boolean
  onClick: () => void
  index: number
  lang: Lang
}

export default function ChoiceButton({ choice, selected, onClick, index, lang }: Props) {
  const text = lang === 'en' && choice.textEn ? choice.textEn : choice.text

  return (
    <motion.button
      onClick={onClick}
      className={`choice-btn w-full text-left rounded-xl p-4 flex items-start gap-3 transition-all ${
        selected
          ? 'shadow-md'
          : 'cozy-card hover:shadow-sm'
      }`}
      style={
        selected
          ? {
              background: 'linear-gradient(135deg, #FEF3E0, #FDF0D5)',
              border: '1.5px solid #C17F24',
            }
          : {}
      }
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      whileTap={{ scale: 0.98 }}
    >
      {choice.emoji && (
        <span className="text-xl shrink-0 mt-0.5">{choice.emoji}</span>
      )}

      <span
        className={`text-sm leading-relaxed thai-text flex-1 ${selected ? 'font-medium' : ''}`}
        style={{ color: selected ? '#8B6347' : 'var(--text-secondary)' }}
      >
        {text}
      </span>

      {selected && (
        <motion.span
          className="ml-auto shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white font-bold"
          style={{ background: '#C17F24' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          ✓
        </motion.span>
      )}
    </motion.button>
  )
}
