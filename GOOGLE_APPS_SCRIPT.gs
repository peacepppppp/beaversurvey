// Google Apps Script — Beaver Worker Project
// ─────────────────────────────────────────────────────────────────────────────
// Setup:
//   1. Open your Google Sheet
//   2. Extensions > Apps Script
//   3. Paste this entire file (replace any existing code)
//   4. Deploy > New deployment > Web app
//      - Execute as: Me
//      - Who has access: Anyone
//   5. Copy the web app URL → paste as GOOGLE_SHEETS_WEBHOOK_URL in Vercel env vars

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Write header row on first use
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'session_id',
        'archetype_id',
        'archetype_name_th',
        'archetype_name_en',
        'rarity',
        // dimension scores
        'social', 'occupational', 'intellectual', 'environmental',
        'spiritual', 'financial', 'emotional', 'physical', 'burnout',
        'completed_at',
        'received_at'
      ]);

      // Bold + freeze the header row
      sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.session_id      || '',
      data.archetype_id    || '',
      data.archetype_name  || '',
      data.archetype_name_en || '',
      data.rarity          || '',
      data.social          || 0,
      data.occupational    || 0,
      data.intellectual    || 0,
      data.environmental   || 0,
      data.spiritual       || 0,
      data.financial       || 0,
      data.emotional       || 0,
      data.physical        || 0,
      data.burnout         || 0,
      data.completed_at    || '',
      new Date().toISOString()
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Health check
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', project: 'BeaverSurvey' }))
    .setMimeType(ContentService.MimeType.JSON);
}
