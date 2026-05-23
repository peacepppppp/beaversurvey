#!/usr/bin/env node
// Usage: node send_test_payload.js <WEBHOOK_URL>
// If WEBHOOK_URL is omitted, reads from process.env.GOOGLE_SHEETS_WEBHOOK_URL

const fetch = require('node-fetch')

async function main() {
  const url = process.argv[2] || process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!url) {
    console.error('Provide webhook URL as arg or set GOOGLE_SHEETS_WEBHOOK_URL')
    process.exit(2)
  }

  const payload = {
    session_id: 'test-' + Date.now(),
    archetype_id: 'cozy-builder',
    archetype_name: 'Cozy Builder',
    rarity: 'common',
    completed_at: new Date().toISOString(),
    social: 25, occupational: 12, intellectual: 10, environmental: 50,
    spiritual: 0, financial: 5, emotional: 8, physical: 20,
    selected_activities: ['Photography outdoors','Rock climbing']
  }

  try {
    const res = await fetch(url, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    const txt = await res.text()
    console.log('status:', res.status)
    console.log(txt)
  } catch (err) {
    console.error('Failed to send payload', err)
    process.exit(1)
  }
}

main()
