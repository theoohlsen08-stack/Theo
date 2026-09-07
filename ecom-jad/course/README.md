# The Jad Method — kursfilen

Mallen som kursens PDF byggs ur. Innehållet är **inte skrivet ännu** — allt inom
`[hakparenteser]` är platshållare, markerade i blått i renderingen så att inget
kan glömmas kvar av misstag.

## Bygga

```sh
./build.sh              # -> jad-method.pdf
./build.sh utkast.pdf   # -> utkast.pdf
```

Skriptet splitsar in `fonts-inline.css` där `<!--FONTS-->` står i
`jad-method.html` och renderar med headless Chromium (`--print-to-pdf`).

## Varför typsnitten ligger som base64

Chromium här inne når **inte** `fonts.gstatic.com` — nätverkspolicyn stoppar den.
`curl` når den däremot, så de fjorton latinska skärningarna av Chakra Petch,
IBM Plex Sans och IBM Plex Mono är nedladdade och inbakade som base64 i
`fonts-inline.css` (438 kB). Renderingen behöver därför inget nät alls.

Ska en skärning till läggas in: hämta CSS:en från `fonts.googleapis.com` med en
webbläsar-User-Agent (annars får man `.ttf` istället för `.woff2`), behåll bara
`latin`- och `latin-ext`-blocken och byt `src: url(...)` mot en `data:`-URI.

## Sidorna

| # | Sida |
| --- | --- |
| 01 | Omslag |
| 02 | Innehåll |
| 03–04 | Kapitel 01 — The model, explained |
| 05–06 | Kapitel 02 — Setup, start to finish |
| 07–08 | Kapitel 03 — Getting your first sale |
| 09–10 | Kapitel 04 — Mistakes that cost money |
| 11 | Avslutning + finstilt |

De fyra kapitlen är exakt de fyra löften produktsidan ger, i samma ordning och med
samma rubriker. Ändras det ena måste det andra ändras med.

Varje kapitel har en öppningssida och en brödtextsida. Räcker inte en sida, duplicera
brödtextsidan — sidnumren i sidfoten och sidhänvisningarna i innehållsförteckningen
räknas om automatiskt av skriptet längst ner i filen. A4 stående, 210×297 mm.

## Byggstenar

Komponenterna finns redan i mallen, en av varje sort, att kopiera:

- `h3` / `h4` / `p` / `ul` / `ol` — löpande text
- `.steps` med `.step` — numrerade moment
- `.split` med `.no` och `.yes` — jämförelse i två spalter (röd mot grön)
- `.note`, `.note.win`, `.note.warn` — utmärkta rutor (cyan, grön, röd)
- `.check` — kryssruteslista

Färgerna och typsnitten är samma som landningssidan och produktbilderna, hämtade
ur samma `:root`-block.

## Finstilta på sista sidan

Sista sidan bär en friskrivning om att guiden inte lovar något resultat. **Den ska
stå kvar.** Kursen säljs till riktiga kunder, och en persona byggd på
e-handelsframgång gör att allt som liknar ett intäktslöfte blir ett
marknadsföringspåstående som måste kunna beläggas. Skriv därför inga
intäktssiffror i kursen heller — varken Jads egna eller en läsares förväntade.

Kvar att fylla i på den sidan: årtal och kontakt-e-post (e-posten är fortfarande
`info.garderobno2@gmail.com` och ska bytas först).
