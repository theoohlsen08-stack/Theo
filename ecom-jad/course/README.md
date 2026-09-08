# The Jad Method — kursfilen

## Filerna

| Fil | Vad det är |
| --- | --- |
| `PLAN.md` | Innehållskarta, sidbudget, faktaregister och avsteg från briefen |
| `design-samples.html` | Sju sidor som visar varje komponenttyp den färdiga kursen behöver |
| `jad-method-full.html` | **Kursen — 122 sidor, alla 21 moduler** |
| `check.sh` | Letar sidor som spiller över sidfoten, och kvarglömda platshållare |
| `preview.sh` | Renderar enskilda sidor som PNG för visuell granskning |
| `course.css` | Formgivningen, delad av kursen och designprovet |
| `jad-method.html` | Den korta produktmallen, elva sidor med platshållare |
| `fonts-inline.css` | Chakra Petch, IBM Plex Sans och IBM Plex Mono som base64 |
| `build.sh` | Renderar valfri av HTML-filerna till PDF |

Källbriefen ligger i Google Docs: **The Jad Method – masterinstruktioner för
Claude Code** (`1SqK2GTXQT1B3yCl58Ihqkohq8lUf6hwwNVEpNKl2DoY`). Läs `PLAN.md`
innan något produceras — den bär de beslut som styr hela kursen.

## Bygga

```sh
./build.sh                              # -> jad-method.pdf
./build.sh design-samples.html          # -> design-samples.pdf
./build.sh jad-method.html utkast.pdf   # -> utkast.pdf
```

Skriptet splitsar in `fonts-inline.css` där `<!--FONTS-->` står i källfilen och
renderar med headless Chromium (`--print-to-pdf`). Det skriver ut sidantal och
filstorlek så att en trasig rendering syns direkt.

## Varför typsnitten ligger som base64

Chromium här inne når **inte** `fonts.gstatic.com` — nätverkspolicyn stoppar den.
`curl` når den däremot, så de fjorton latinska skärningarna av Chakra Petch,
IBM Plex Sans och IBM Plex Mono är nedladdade och inbakade som base64 i
`fonts-inline.css` (438 kB). Renderingen behöver därför inget nät alls.

Ska en skärning till läggas in: hämta CSS:en från `fonts.googleapis.com` med en
webbläsar-User-Agent (annars får man `.ttf` istället för `.woff2`), behåll bara
`latin`- och `latin-ext`-blocken och byt `src: url(...)` mot en `data:`-URI.

## Produktmallens sidor

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

## Komponenter i `design-samples.html`

Kursen behöver mer än brödtext. De här är byggda och verifierade:

| Klass | Vad den gör |
| --- | --- |
| `.code` | Terminalruta med radbrytning som inte kapar långa kommandon |
| `table` | Fåkolumnstabell för felsökning och kalkyler |
| `.ws` | Arbetsblad med poängrutor 1–5 och totalrad |
| `.fig` + `.figcap` | Figur med bildnummer, förklaring och märkning |
| `.note` / `.win` / `.warn` | Utmärkta rutor i cyan, grönt och rött |
| `.stamp` | "Last verified"-datum, krävs av briefen § 28.1 |
| `.illus` | "Illustrative example", krävs för varje räkneexempel |
| `.src` | Klickbar källhänvisning nära påståendet |

### Varför figurerna säger "Simplified illustration"

Briefen vill ha riktiga skärmbilder ur Shopify Admin, Meta Ads Manager, TikTok
Ads Manager, Google Ads och Google AI Studio. Härifrån går det inte — det finns
ingen inloggad webbläsarsession mot de gränssnitten. Briefen § 14.2 punkt 6 säger
vad som gäller då: en tydligt märkt förenklad illustration, aldrig en falsk
skärmbild. Varje figur bär därför märkningen och menyvägen i text.

## Kör alltid check.sh efter en ändring

```sh
./check.sh                      # jad-method-full.html
./check.sh design-samples.html
./preview.sh 12 18              # -> /tmp/jad-preview/p12.png
```

`check.sh` hoppar över `<pre>`-block när den letar platshållare, eftersom
mallar som läsaren själv fyller i avsiktligt innehåller hakparenteser.

## Kontrollera att en sida inte spiller över

A4 minus marginaler ger cirka 249 mm text. Sidfoten ligger absolut, så innehåll
som växer förbi den försvinner tyst under den. Rendera och mät istället för att
lita på ögonmått — två av designprovets sidor spillde över första gången och
fick delas.
