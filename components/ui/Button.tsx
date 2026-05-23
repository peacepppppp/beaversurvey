 'use client'

import React from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
}

export default function Button({ variant = 'primary', className = '', children, ...rest }: Props) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-opacity disabled:opacity-50'
  const v = variant === 'primary'
    ? 'bg-indigo-600 text-white shadow-sm hover:opacity-90'
    : 'bg-transparent text-secondary'

  return (
    <button className={`${base} ${v} ${className}`} {...rest}>
      {children}
    </button>
  )
}
