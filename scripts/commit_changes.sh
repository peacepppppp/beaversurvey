#!/usr/bin/env bash
# Helper to commit local changes with a standard message. Does not push.
MSG=${1:-"chore: add webhook test script, placeholders, docs, UI button and CSS polish"}

git add -A
if git diff --cached --quiet; then
  echo "No changes to commit"
  exit 0
fi

git commit -m "$MSG"

echo "Committed. To push run: git push origin <branch>" 
