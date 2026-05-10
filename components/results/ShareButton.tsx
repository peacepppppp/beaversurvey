'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Archetype, Lang } from '@/types/survey'

interface Props {
  archetype: Archetype
  lang: Lang
}

export default function ShareButton({ archetype, lang }: Props) {
  const [copied, setCopied] = useState(false)

  const name = lang === 'th' ? archetype.name : archetype.nameEn
  const quote = lang === 'th' ? archetype.quote : archetype.quoteEn

  const shareText =
    lang === 'th'
      ? `ฉันคือ "${name}" ${archetype.emoji}\n"${quote}"\n— Beaver Worker Project`
      : `I'm "${name}" ${archetype.emoji}\n"${quote}"\n— Beaver Worker Project`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${window.location.origin}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
    }
  }

  function handleLineShare() {
    const url = encodeURIComponent(window.location.origin)
    const text = encodeURIComponent(shareText)
    window.open(`https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`, '_blank')
  }

  function handleNativeShare() {
    if (navigator.share) {
      navigator.share({
        title: 'Beaver Worker Project',
        text: shareText,
        url: window.location.origin,
      })
    }
  }

  return (
    <div className="space-y-2.5">
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="w-full py-3.5 rounded-xl font-semibold text-white text-sm thai-text"
          style={{ background: `linear-gradient(135deg, ${archetype.color}, ${archetype.color}AA)` }}
        >
          {lang === 'th' ? 'แชร์ให้เพื่อน 🦫' : 'Share with friends 🦫'}
        </button>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleLineShare}
          className="flex-1 py-3 rounded-xl cozy-card text-sm transition-colors thai-text flex items-center justify-center gap-1.5"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span>💚</span> LINE
        </button>

        <button
          onClick={handleCopy}
          className="flex-1 py-3 rounded-xl cozy-card text-sm transition-colors flex items-center justify-center gap-1.5"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="copied"
                className="text-green-600 thai-text text-sm"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                ✓ {lang === 'th' ? 'คัดลอกแล้ว' : 'Copied!'}
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                className="thai-text text-sm"
                style={{ color: 'var(--text-secondary)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                🔗 {lang === 'th' ? 'คัดลอกลิงก์' : 'Copy link'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}
