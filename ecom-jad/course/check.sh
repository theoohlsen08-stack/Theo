#!/usr/bin/env bash
# Kontrollerar en kursfil: sidor som spiller över sidfoten, och
# platshållare som glömts kvar. Briefen § 30 förbjuder det senare i slutfilen.
#
#   ./check.sh                    -> jad-method-full.html
#   ./check.sh design-samples.html
set -euo pipefail
cd "$(dirname "$0")"
SRC="${1:-jad-method-full.html}"
CHROME="${CHROME:-/opt/pw-browsers/chromium-1194/chrome-linux/chrome}"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

python3 - "$SRC" "$TMP/probe.html" <<'PY'
import sys
html = open(sys.argv[1], encoding='utf-8').read()
html = html.replace('<!--FONTS-->', '<style>\n%s\n</style>'
                    % open('fonts-inline.css', encoding='utf-8').read(), 1)
if '<!--STYLES-->' in html:
    html = html.replace('<!--STYLES-->', '<style>\n%s\n</style>'
                        % open('course.css', encoding='utf-8').read(), 1)
probe = """
<script>window.addEventListener('load',function(){var o=[];
 document.querySelectorAll('.page').forEach(function(pg,i){
   var pr=pg.getBoundingClientRect();
   var k=[].slice.call(pg.children).filter(function(e){
     return !e.classList.contains('halo')&&!e.classList.contains('runner');});
   var last=k.length?k[k.length-1].getBoundingClientRect().bottom-pr.top:0;
   var r=pg.querySelector('.runner');
   var rt=r?r.getBoundingClientRect().top-pr.top:pr.height;
   if(last>rt) o.push('sida '+(i+1)+' spiller over med '+Math.round(last-rt)+'px');});
 document.title='PROBE::'+(o.length?o.join(' | '):'inga overflows');});</script>
</body>"""
open(sys.argv[2], 'w', encoding='utf-8').write(html.replace('</body>', probe, 1))
PY

"$CHROME" --headless --disable-gpu --no-sandbox --window-size=794,1300 \
  --virtual-time-budget=9000 --dump-dom "file://$TMP/probe.html" 2>/dev/null \
  | grep -o '<title>PROBE::[^<]*' | sed 's|<title>PROBE::|layout: |'

python3 - "$SRC" <<'PY'
import re, sys
src = open(sys.argv[1], encoding='utf-8').read()
body = src[src.index('<body>'):]
body = re.sub(r'(?s)<!--.*?-->', '', body)          # kommentarer räknas inte
ph = re.findall(r'\[[^\]\n]{2,60}\]', body)
ph = [p for p in ph if not re.match(r'^\[\d+\]$', p)]
todo = re.findall(r'\b(TODO|FIXME|lorem ipsum|BEHÖVER VERIFIERAS)\b', body, re.I)
print('platshållare:', ph if ph else 'inga')
print('TODO/lorem:', todo if todo else 'inga')
print('sidor:', body.count('class="page'))
PY
