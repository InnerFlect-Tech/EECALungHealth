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

# The production build strips the internal review/comparison bodies from dist/
# (see the strip-internal-concept-note-editions plugin in vite.config.ts) so they
# never reach the public server. The printer serves dist/, so put them back for
# the duration of this script — locally only. CI never runs this script, so the
# dist/ it deploys stays clean.
echo "Restoring internal editions into dist/ for printing …"
for f in concept-note-body-full.html concept-note-body-diff.html concept-note-body-ru-diff.html; do
  [[ -f "$ROOT/public/$f" ]] && cp "$ROOT/public/$f" "$ROOT/dist/$f"
done

# Serve dist/ via vite preview in the background.
echo "Starting preview on :$PORT …"
( cd "$ROOT" && npx vite preview --port "$PORT" --strictPort ) >/tmp/eeca-preview.log 2>&1 &
PREVIEW_PID=$!
cleanup() {
  # $PREVIEW_PID is the subshell; the npx/node server is its grandchild, so
  # killing the subshell alone leaves a server bound to the port. A stale one
  # silently serves an older dist/ on the next run, which is very hard to spot.
  pkill -P $PREVIEW_PID 2>/dev/null || true
  kill $PREVIEW_PID 2>/dev/null || true
  lsof -ti:"$PORT" 2>/dev/null | xargs -r kill 2>/dev/null || true
  rm -f "$ROOT"/dist/concept-note-body-full.html \
        "$ROOT"/dist/concept-note-body-diff.html \
        "$ROOT"/dist/concept-note-body-ru-diff.html
}
trap cleanup EXIT

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
