import type { Metadata } from 'next'
import { Sarabun } from 'next/font/google'
import './globals.css'

const sarabun = Sarabun({
  variable: '--font-sarabun',
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'คุณเป็นบีเวอร์แบบไหน? — Beaver Worker Project',
  description:
    'อาณานิคมบีเวอร์ต้องสร้างเขื่อนให้เสร็จใน 7 วัน แล้วคุณล่ะ เป็นบีเวอร์แบบไหน? Which Beaver Are You?',
  openGraph: {
    title: 'คุณเป็นบีเวอร์แบบไหน?',
    description: 'Beaver Worker Project — ค้นพบบีเวอร์ในตัวคุณ',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={`${sarabun.variable} h-full`}>
      <body className="min-h-full bg-[#FDFAF4] text-[#2C1A0F] overflow-x-hidden">
        {/* Warm parchment texture overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(212,148,90,0.08) 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, rgba(139,99,71,0.06) 0%, transparent 50%)`,
          }}
        />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}
