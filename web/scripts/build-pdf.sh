#!/usr/bin/env bash
# Regenerate web/public/concept-note.pdf from the built dist/.
# Uses macOS Chrome's headless PDF export — no runtime deps, no puppeteer.
#
# Usage:
#   cd web && npm run build && ../scripts/build-pdf.sh
#
# Or from anywhere:
#   bash "$(git rev-parse --show-toplevel)/web/scripts/build-pdf.sh"

set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT=4173
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/concept-note.pdf"

if [[ ! -x "$CHROME" ]]; then
  echo "Chrome not found at $CHROME — install Google Chrome or edit this script."
  exit 1
fi

if [[ ! -d "$ROOT/dist" ]]; then
  echo "web/dist/ missing — run 'npm run build' first."
  exit 1
fi

# Serve dist/ via vite preview in the background.
echo "Starting preview on :$PORT …"
( cd "$ROOT" && npx vite preview --port "$PORT" --strictPort ) >/tmp/eeca-preview.log 2>&1 &
PREVIEW_PID=$!
trap 'kill $PREVIEW_PID 2>/dev/null || true' EXIT

# Wait for the server to accept requests.
for _ in $(seq 1 30); do
  if curl -sf "http://localhost:$PORT/" -o /dev/null; then break; fi
  sleep 1
done

echo "Printing /concept-note to $OUT …"
node "$ROOT/scripts/print-pdf.mjs" "$PORT" "$OUT"

echo "Wrote $(wc -c < "$OUT" | awk '{print int($1/1024)}') KB → $OUT"
