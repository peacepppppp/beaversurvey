// Google Sheets backup via Apps Script webhook
// Deploy your Apps Script as a web app and set GOOGLE_SHEETS_WEBHOOK_URL in .env.local
// Apps Script code is in /GOOGLE_APPS_SCRIPT.gs

export interface SheetRow {
  session_id: string
  archetype_id: string
  archetype_name: string
  social: number
  occupational: number
  intellectual: number
  environmental: number
  spiritual: number
  financial: number
  emotional: number
  physical: number
  completed_at: string
}

export async function backupToSheets(row: SheetRow): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!webhookUrl) return // silently skip if not configured

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    })
  } catch {
    // Sheets backup is non-critical — never throw, just log
    console.warn('[sheets] backup failed, continuing without it')
  }
}
