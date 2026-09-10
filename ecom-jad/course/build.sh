#!/usr/bin/env bash
# Bygger en PDF ur en av kursens HTML-filer.
#
# Typsnitten bakas in som base64 ur fonts-inline.css, så renderingen
# behöver inget nät — Chromium når ändå inte fonts.gstatic.com.
#
#   ./build.sh                              -> jad-method.pdf
#   ./build.sh design-samples.html          -> design-samples.pdf
#   ./build.sh jad-method.html utkast.pdf   -> utkast.pdf
set -euo pipefail

cd "$(dirname "$0")"
SRC="${1:-jad-method.html}"
OUT="${2:-${SRC%.html}.pdf}"
CHROME="${CHROME:-/opt/pw-browsers/chromium-1194/chrome-linux/chrome}"
[ -f "$SRC" ] || { echo "hittar inte $SRC" >&2; exit 1; }
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Splitsa in typsnitts-CSS:en där <!--FONTS--> står.
python3 - "$SRC" "$TMP/page.html" <<'PY'
import sys
html  = open(sys.argv[1], encoding='utf-8').read()
fonts = open('fonts-inline.css', encoding='utf-8').read()
assert '<!--FONTS-->' in html, 'markören <!--FONTS--> saknas i ' + sys.argv[1]
html = html.replace('<!--FONTS-->', '<style>\n' + fonts + '\n</style>', 1)
if '<!--STYLES-->' in html:
    styles = open('course.css', encoding='utf-8').read()
    html = html.replace('<!--STYLES-->', '<style>\n' + styles + '\n</style>', 1)
open(sys.argv[2], 'w', encoding='utf-8').write(html)
PY

"$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --no-pdf-header-footer --virtual-time-budget=8000 \
  --print-to-pdf="$TMP/out.pdf" "file://$TMP/page.html" 2>/dev/null

mv "$TMP/out.pdf" "$OUT"
python3 - "$OUT" <<'PY'
import re,sys
raw=open(sys.argv[1],'rb').read()
print("%s — %d sidor, %.0f kB" % (sys.argv[1],
      len(re.findall(rb'/Type\s*/Page[^s]', raw)), len(raw)/1024))
PY
