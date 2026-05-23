#!/usr/bin/env bash
# Simple wrapper to call the Node helper or curl
WEBHOOK=${1:-$GOOGLE_SHEETS_WEBHOOK_URL}
if [ -z "$WEBHOOK" ]; then
  echo "Usage: $0 <WEBHOOK_URL> (or set GOOGLE_SHEETS_WEBHOOK_URL)"
  exit 2
fi

if command -v node >/dev/null 2>&1; then
  node ./scripts/send_test_payload.js "$WEBHOOK"
else
  curl -X POST "$WEBHOOK" -H 'Content-Type: application/json' -d '{"session_id":"test-123","archetype_id":"cozy-builder","archetype_name":"Cozy Builder","rarity":"common","completed_at":"2026-05-23T00:00:00Z","social":25,"occupational":12,"intellectual":10,"environmental":50,"spiritual":0,"financial":5,"emotional":8,"physical":20,"selected_activities":["Photography outdoors","Rock climbing"]}'
fi
