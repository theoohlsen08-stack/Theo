#!/usr/bin/env bash
# Bygger jad-method.pdf ur jad-method.html.
#
# Typsnitten bakas in som base64 ur fonts-inline.css, så renderingen
# behöver inget nät — Chromium når ändå inte fonts.gstatic.com.
#
#   ./build.sh              -> jad-method.pdf
#   ./build.sh utkast.pdf   -> utkast.pdf
set -euo pipefail

cd "$(dirname "$0")"
OUT="${1:-jad-method.pdf}"
CHROME="${CHROME:-/opt/pw-browsers/chromium-1194/chrome-linux/chrome}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Splitsa in typsnitts-CSS:en där <!--FONTS--> står.
python3 - "$TMP/jad-method.html" <<'PY'
import sys
html  = open('jad-method.html', encoding='utf-8').read()
fonts = open('fonts-inline.css', encoding='utf-8').read()
assert '<!--FONTS-->' in html, 'markören <!--FONTS--> saknas i jad-method.html'
open(sys.argv[1], 'w', encoding='utf-8').write(
    html.replace('<!--FONTS-->', '<style>\n' + fonts + '\n</style>', 1))
PY

"$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --no-pdf-header-footer --virtual-time-budget=8000 \
  --print-to-pdf="$TMP/out.pdf" "file://$TMP/jad-method.html" 2>/dev/null

mv "$TMP/out.pdf" "$OUT"
echo "$OUT — $(du -h "$OUT" | cut -f1)"
