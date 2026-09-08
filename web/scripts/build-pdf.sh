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

# Three editions of the note: the doc-faithful English one that goes live, the
# full English one with everything not in the source doc marked in red, and the
# Russian one. Pass an edition name to build just that one.
print_edition() {
  local out="$1" path="$2"
  echo "Printing $path → $(basename "$out") …"
  node "$ROOT/scripts/print-pdf.mjs" "$PORT" "$out" "$path"
  echo "  $(wc -c < "$out" | awk '{print int($1/1024)}') KB"
}

case "${1:-all}" in
  en)   print_edition "$OUT" "/concept-note?lang=en" ;;
  full) print_edition "$ROOT/public/concept-note-full.pdf" "/concept-note?doc=full&lang=en" ;;
  diff) print_edition "$ROOT/public/concept-note-diff.pdf" "/concept-note?doc=diff&lang=en" ;;
  ru)   print_edition "$ROOT/public/concept-note-ru.pdf" "/concept-note?doc=ru&lang=ru"
        print_edition "$ROOT/public/concept-note-ru-diff.pdf" "/concept-note?doc=ru-diff&lang=ru" ;;
  all)
    print_edition "$OUT" "/concept-note?lang=en"
    print_edition "$ROOT/public/concept-note-full.pdf" "/concept-note?doc=full&lang=en"
    print_edition "$ROOT/public/concept-note-diff.pdf" "/concept-note?doc=diff&lang=en"
    if [[ -f "$ROOT/public/concept-note-body-ru.html" ]]; then
      print_edition "$ROOT/public/concept-note-ru.pdf" "/concept-note?doc=ru&lang=ru"
      print_edition "$ROOT/public/concept-note-ru-diff.pdf" "/concept-note?doc=ru-diff&lang=ru"
    else
      echo "Skipping RU edition — public/concept-note-body-ru.html not present."
    fi
    ;;
  *) echo "Usage: build-pdf.sh [en|full|diff|ru|all]"; exit 1 ;;
esac
