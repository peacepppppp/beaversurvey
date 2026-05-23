import { NextRequest, NextResponse } from 'next/server'
import { buildResult } from '@/lib/scoring'
import { SurveyAnswer } from '@/types/survey'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const answers: SurveyAnswer[] = body.answers
    const activities: string[] = Array.isArray(body.activities) ? body.activities : []
    const dimensionTotals = body.dimensionTotals ?? null

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: 'Invalid answers' }, { status: 400 })
    }

    const { rawScores, normalizedScores, archetype } = buildResult(answers)
    const sessionId = crypto.randomUUID()
    const completedAt = new Date().toISOString()

    // Save to Google Sheets (non-blocking — result is returned immediately)
    const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL
    if (webhook) {
      const payload: Record<string, unknown> = {
        session_id: sessionId,
        archetype_id: archetype.id,
        archetype_name: archetype.name,
        archetype_name_en: archetype.nameEn,
        rarity: archetype.rarity,
        completed_at: completedAt,
        // normalized scores as individual fields
        ...normalizedScores,
      }

      if (dimensionTotals) payload.dimension_totals = dimensionTotals
      if (activities && activities.length > 0) payload.selected_activities = activities

      fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {})
    }

    return NextResponse.json({
      sessionId,
      rawScores,
      normalizedScores,
      archetype,
      completedAt,
      activities,
      dimensionTotals,
    })
  } catch (err) {
    console.error('[submit]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
