#!/usr/bin/env python3
"""Genererar Shopify-sidans body ur landing-page.html.

Shopify klistrar in sidinnehållet mitt i temat, så CSS:en måste scopas till
#jad-lp — annars läcker den ut och färgar hela butiken. Shopify strippar
dessutom <link> i sidinnehåll, så typsnitten måste in via @import.

    python3 build-shopify-page.py            -> shopify-page.html
"""
import re, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(HERE, 'landing-page.html')
OUT  = os.path.join(HERE, 'shopify-page.html')
ROOT = '#jad-lp'

FONT_IMPORT = ('  @import url("https://fonts.googleapis.com/css2?family=Chakra+Petch:'
               'wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:'
               'wght@400;500;600&display=swap");\n\n')


def scope_selector(sel):
    """Prefixar en selektor med #jad-lp, med undantag för rot och body."""
    out = []
    for part in sel.split(','):
        p = part.strip()
        if not p:
            continue
        if p == '*':
            out.append(ROOT); out.append(ROOT + ' *')
        elif p in (':root', 'html', 'body'):
            out.append(ROOT)
        elif p.startswith('body::') or p.startswith('body:'):
            out.append(ROOT + p[4:])
        elif p.startswith('html '):
            out.append(ROOT + ' ' + p[5:])
        elif p.startswith('body '):
            out.append(ROOT + ' ' + p[5:])
        else:
            out.append(ROOT + ' ' + p)
    return ', '.join(out)


def scope_css(css):
    """Går igenom regel för regel och scopar varje selektor.

    Enkel klammerräknare räcker: filen har inga nästlade regler utom @media.
    """
    res, i, n = [], 0, len(css)
    while i < n:
        brace = css.find('{', i)
        if brace == -1:
            res.append(css[i:]); break
        head = css[i:brace]
        # Allt efter sista kommentarslutet är selektorn; kommentarerna
        # före den ska stå kvar orörda.
        cut = head.rfind('*/')
        lead = head[:cut + 2] if cut != -1 else ''
        sel = head[cut + 2:] if cut != -1 else head
        sel_s = sel.strip()

        if sel_s.startswith('@media'):
            # Hitta blockets slut och scopa innehållet rekursivt.
            depth, j = 0, brace
            while j < n:
                if css[j] == '{': depth += 1
                elif css[j] == '}':
                    depth -= 1
                    if depth == 0: break
                j += 1
            res.append(lead + sel + '{')
            res.append(scope_css(css[brace + 1:j]))
            res.append('}')
            i = j + 1
            continue

        end = css.find('}', brace)
        if end == -1:
            res.append(css[i:]); break
        body = css[brace + 1:end]
        res.append(lead + '\n  ' + scope_selector(sel_s) + ' {' + body + '}')
        i = end + 1
    return ''.join(res)


def main():
    src = open(SRC, encoding='utf-8').read()

    m = re.search(r'(?s)<style>(.*?)</style>', src)
    if not m:
        sys.exit('hittar ingen <style> i landing-page.html')
    css    = m.group(1)
    markup = src[m.end():].strip()

    css = scope_css(css)

    # --- fixar som bara gäller den inbäddade versionen ---
    # Sidan ligger i temat, inte på egen rot: fixed blir absolute.
    css = css.replace('position: fixed;', 'position: absolute;')
    # overflow: hidden krävs för att bakgrundsrutnätet inte ska spilla ut,
    # men det dödar samtidigt position: sticky utan att säga till. Sidhuvudet
    # får därför inte vara sticky här — det är det i den fristående sidan.
    css = css.replace('    position: sticky;\n    top: 0;\n', '')
    css = re.sub(r'(' + re.escape(ROOT) + r' \{)',
                 r'\1\n    position: relative;\n    overflow: hidden;', css, count=1)

    body = '<style>\n' + FONT_IMPORT + css.strip() + '\n</style>\n' \
           + '<div id="jad-lp">\n' + markup + '\n</div>'
    open(OUT, 'w', encoding='utf-8').write(body)
    print('shopify-page.html — %d kB' % (len(body.encode()) / 1024))
    print('scopade regler:', body.count(ROOT))


if __name__ == '__main__':
    main()
