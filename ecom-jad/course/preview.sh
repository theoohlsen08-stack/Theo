#!/usr/bin/env bash
# Renderar enskilda sidor ur en kursfil som PNG, för visuell kontroll.
#   ./preview.sh 12 18            -> /tmp/jad-preview/p12.png, p18.png
#   ./preview.sh design-samples.html 3
set -euo pipefail
cd "$(dirname "$0")"
SRC="jad-method-full.html"
if [[ "${1:-}" == *.html ]]; then SRC="$1"; shift; fi
OUT="${PREVIEW_OUT:-/tmp/jad-preview}"
CHROME="${CHROME:-/opt/pw-browsers/chromium-1194/chrome-linux/chrome}"
mkdir -p "$OUT"

python3 - "$SRC" "$OUT/preview.html" <<'PY'
import sys
html = open(sys.argv[1], encoding='utf-8').read()
html = html.replace('<!--FONTS-->', '<style>\n%s\n</style>'
                    % open('fonts-inline.css', encoding='utf-8').read(), 1)
if '<!--STYLES-->' in html:
    html = html.replace('<!--STYLES-->', '<style>\n%s\n</style>'
                        % open('course.css', encoding='utf-8').read(), 1)
inj = """
<style>body[data-p] .page{display:none}body[data-p] .page.show{display:flex}
body[data-p]{background:#05070F}</style>
<script>document.addEventListener('DOMContentLoaded',function(){
 var p=+(new URLSearchParams(location.search).get('p')||1);
 document.body.setAttribute('data-p',p);
 var g=document.querySelectorAll('.page'); if(g[p-1])g[p-1].classList.add('show');});</script>
</body>"""
open(sys.argv[2], 'w', encoding='utf-8').write(html.replace('</body>', inj, 1))
PY

for p in "$@"; do
  # Viewporten är kortare än window-size, så det behövs marginal för A4:s 1123px.
  "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size=794,1215 --virtual-time-budget=7000 \
    --screenshot="$OUT/p$p.png" "file://$OUT/preview.html?p=$p" 2>/dev/null
  echo "$OUT/p$p.png"
done
