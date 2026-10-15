#!/usr/bin/env bash
# Post-deploy check: fetches every sitemap URL the way ChatGPT's browser does
# (no JavaScript) and fails if any page is missing its text. Also checks the
# SPA fallback still serves admin routes. Usage: scripts/smoke-test.sh [base-url]
set -euo pipefail
BASE="${1:-https://eecalunghealth.com}"
UA='Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot'
MIN_CHARS=400
fail=0

urls=$(curl -fsS "$BASE/sitemap.xml" | grep -o '<loc>[^<]*' | sed 's/<loc>//; s#https://eecalunghealth.com#'"$BASE"'#')
[ -n "$urls" ] || { echo "FAIL sitemap.xml empty"; exit 1; }

for url in $urls; do
  # Cache-buster so a CDN/LiteSpeed cache can't hide a stale page.
  body=$(curl -sS -A "$UA" -w '\n%{http_code}' "$url?smoke=$RANDOM") || { echo "FAIL $url (fetch)"; fail=1; continue; }
  code=$(tail -n1 <<<"$body")
  chars=$(sed '$d' <<<"$body" | sed -n '/<div id="root">/,$p' | sed 's/<script.*<\/script>//; s/<[^>]*>/ /g' | tr -s '[:space:]' ' ' | wc -c | tr -d ' ')
  if [ "$code" != 200 ] || [ "$chars" -lt "$MIN_CHARS" ]; then
    echo "FAIL $url (HTTP $code, $chars chars of text)"; fail=1
  else
    echo "ok   $url ($chars chars)"
  fi
done

code=$(curl -sS -o /dev/null -w '%{http_code}' "$BASE/admin/login")
[ "$code" = 200 ] && echo "ok   $BASE/admin/login (SPA fallback)" || { echo "FAIL $BASE/admin/login (HTTP $code)"; fail=1; }

exit $fail
