Deployment & Google Sheets webhook

This document explains how to run the app locally, deploy it (Vercel), and configure the Google Sheets webhook used to persist survey results.

1) Environment

- `GOOGLE_SHEETS_WEBHOOK_URL` (optional): URL of the Google Apps Script Web App that accepts POST requests and writes rows into a Google Sheet. If not set, the app still runs but will not push results to Sheets.

2) Local development

```bash
npm install
npm run dev
# open http://localhost:3000
```

3) Build / deploy (Vercel recommended)

- Connect the repository to Vercel and deploy. Add the environment variable `GOOGLE_SHEETS_WEBHOOK_URL` in Project Settings → Environment Variables.
- Build command: `npm run build` (Vercel uses this automatically for Next.js).

4) Google Apps Script webhook (example)

Create a new Google Apps Script project and replace Code.gs with the following minimal handler. Deploy as "Web app" (execute as: Me, who has permission: Anyone) and copy the web app URL.

```javascript
function doPost(e) {
  try {
    const sheetId = '<<YOUR_SPREADSHEET_ID>>'
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet()
    const payload = JSON.parse(e.postData.contents)

    // Adjust columns/order as you prefer
    const row = [
      payload.session_id || payload.user_id || '',
      payload.completed_at || new Date().toISOString(),
      payload.archetype_id || payload.beaver_type || '',
      payload.archetype_name || payload.beaver_type || '',
      payload.rarity || '',
      payload.soc_score ?? '',
      payload.occ_score ?? '',
      payload.int_score ?? '',
      payload.env_score ?? '',
      payload.spi_score ?? '',
      payload.fin_score ?? '',
      payload.emo_score ?? '',
      payload.phy_score ?? '',
      JSON.stringify(payload.selected_activities || payload.selectedActivities || []),
      JSON.stringify(payload.dimension_totals || payload.rawScores || payload.normalizedScores || {}),
      JSON.stringify(payload, null, 2),
    ]

    sheet.appendRow(row)
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON)
  }
}
```

Notes:
- Set `sheetId` to the ID of the Google Sheet where you want rows appended.
- When deploying, make sure the web app permissions allow POST requests from your deployed site (set to "Anyone, even anonymous" if you prefer public webhook).

5) Payload format the app sends

When a user completes the activity selection, the app POSTs to `/api/submit` which then forwards the following fields to the webhook (if `GOOGLE_SHEETS_WEBHOOK_URL` is set):

- `session_id` (string)
- `archetype_id` (string)
- `archetype_name`, `archetype_name_en` (string)
- `rarity` (string)
- `completed_at` (ISO timestamp)
- normalized scores as fields: `social`, `occupational`, `intellectual`, `environmental`, `spiritual`, `financial`, `emotional`, `physical` (numbers, 0-100)
- `dimension_totals` (optional) — raw per-dimension counters if provided
- `selected_activities` — array of chosen activity strings

6) Testing the webhook manually

Use curl to POST a sample payload to your webhook URL:

```bash
curl -X POST $GOOGLE_SHEETS_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{"session_id":"test-123","archetype_id":"cozy-builder","archetype_name":"Cozy Builder","rarity":"common","completed_at":"2026-05-23T00:00:00Z","social":25,"occupational":12,"intellectual":10,"environmental":50,"spiritual":0,"financial":5,"emotional":8,"physical":20,"selected_activities":["Photography outdoors","Rock climbing"]}'
```

7) Troubleshooting

- 404s on beaver images: add PNGs named by archetype slug into `public/beavers/{slug}.png`. A `placeholder.svg` fallback is included at `public/beavers/placeholder.svg`.
- If webhook calls fail: verify `GOOGLE_SHEETS_WEBHOOK_URL` is set and reachable, check deploy permissions on the Apps Script web app.
- Local storage persistence: results are kept in `localStorage` under `beaversurvey_state` to preserve mid-flow state.

8) Optional improvements

- Add proper image assets into `public/beavers/` for each `id` in `data/archetypes.ts`.
- Add server-side logging or retry logic for the webhook (the app already uses a small retry for GAS).

If you'd like, I can:
- Add the `DEPLOYMENT.md` content into the `README.md` instead, or
- Create a `scripts/` helper that bootstraps a sample Google Sheet with headers.

