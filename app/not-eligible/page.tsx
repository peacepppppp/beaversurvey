'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function NotEligible() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center"
      style={{ background: 'var(--bg-primary)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm w-full"
      >
        <div className="text-6xl mb-6">🦫</div>

        <h1
          className="text-2xl font-bold mb-3 thai-text"
          style={{ color: 'var(--text-primary)' }}
        >
          ขออภัยนะ...
        </h1>

        <div
          className="cozy-card rounded-2xl p-6 mb-6 text-left"
        >
          <p className="text-sm thai-text leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            เว็บนี้สำหรับ<strong>นักศึกษาแพทยศาสตร์ มหาวิทยาลัยขอนแก่น</strong>เท่านั้น 🏥
          </p>
          <p className="text-sm thai-text leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Beaver Worker Project เป็นโปรเจกต์ HRD ภายในของคณะแพทยศาสตร์ มข.
            ออกแบบมาเพื่อนักศึกษาแพทย์โดยเฉพาะ
          </p>
        </div>

        <p className="text-sm thai-text mb-6" style={{ color: 'var(--text-muted)' }}>
          ถ้าคุณเป็นนักศึกษาแพทย์ มข. และกดผิด ลองใหม่ได้เลย 🦫
        </p>

        <Link
          href="/"
          className="inline-block w-full py-3.5 rounded-2xl font-semibold text-white text-sm text-center thai-text"
          style={{ background: 'linear-gradient(135deg, #8B6347, #C17F24)' }}
        >
          ← กลับไปหน้าแรก
        </Link>
      </motion.div>
    </div>
  )
}
